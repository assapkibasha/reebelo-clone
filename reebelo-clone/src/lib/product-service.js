import { v2 as cloudinary } from "cloudinary";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "kg-phone-store";
const collectionName = process.env.MONGODB_PRODUCTS_COLLECTION || "phones";

let clientPromise;

function formatMongoError(error) {
  const message = error?.message || "MongoDB connection failed.";

  if (message.includes("querySrv ETIMEOUT")) {
    return "MongoDB Atlas DNS lookup timed out. Check your network DNS or use Atlas' standard connection string instead of mongodb+srv.";
  }

  if (message.includes("tlsv1 alert internal error") || message.includes("SSL routines")) {
    return "MongoDB Atlas rejected the SSL connection. Check Atlas Network Access/IP allowlist, cluster status, and the MongoDB connection string.";
  }

  return message;
}

function formatCloudinaryError(error) {
  const message = error?.message || "Cloudinary upload failed.";

  if (message.includes("getaddrinfo ENOTFOUND api.cloudinary.com")) {
    return "Cloudinary DNS lookup failed. Check your internet/DNS connection, then retry the image upload.";
  }

  if (message.includes("ENOTFOUND") || message.includes("EAI_AGAIN")) {
    return "Cloudinary could not be reached through DNS. Check your internet/DNS connection, then retry.";
  }

  return message;
}

function assertMongoConfigured() {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }
}

function getClient() {
  assertMongoConfigured();
  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }
  return clientPromise;
}

async function productsCollection() {
  const client = await getClient();
  return client.db(dbName).collection(collectionName);
}

function toProductTuple(doc) {
  return [
    doc.name,
    doc.specs,
    Number(doc.price),
    doc.image,
    doc.tag || doc.brand || "In Stock",
    String(doc._id),
    doc.source || "admin",
    doc.brand || "",
    Boolean(doc.featured),
  ];
}

export async function listProducts() {
  try {
    const collection = await productsCollection();
    const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
    const products = docs.map(toProductTuple);

    return {
      products,
      adminProducts: products.filter((product) => product[6] !== "seed"),
      databaseReady: true,
    };
  } catch (error) {
    return {
      products: [],
      adminProducts: [],
      databaseReady: false,
      error: formatMongoError(error),
    };
  }
}

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

async function uploadImage(file) {
  try {
    configureCloudinary();
    const bytes = Buffer.from(await file.arrayBuffer());

    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER || "kg-phone-store/phones",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed."));
            return;
          }
          resolve(result);
        },
      );

      stream.end(bytes);
    });
  } catch (error) {
    throw new Error(formatCloudinaryError(error));
  }
}

export async function createProduct(formData) {
  const name = String(formData.get("name") || "").trim();
  const brand = String(formData.get("brand") || "").trim();
  const specs = String(formData.get("specs") || "").trim();
  const price = Number(String(formData.get("price") || "").replaceAll(",", ""));
  const tag = String(formData.get("tag") || "New Stock").trim();
  const featured = formData.get("featured") === "true";
  const imageFile = formData.get("image");

  if (!name || !brand || !specs || !Number.isFinite(price) || price <= 0 || !imageFile || typeof imageFile === "string" || imageFile.size === 0) {
    throw new Error("Invalid phone payload.");
  }

  try {
    const upload = await uploadImage(imageFile);
    const collection = await productsCollection();
    const doc = {
      name,
      brand,
      specs,
      price,
      tag: tag || brand,
      image: upload.secure_url,
      cloudinaryPublicId: upload.public_id,
      featured,
      source: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(doc);
    return toProductTuple({ ...doc, _id: result.insertedId });
  } catch (error) {
    throw new Error(formatMongoError(error));
  }
}

export async function updateProduct(id, formData) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid product id.");
  }

  const name = String(formData.get("name") || "").trim();
  const brand = String(formData.get("brand") || "").trim();
  const specs = String(formData.get("specs") || "").trim();
  const price = Number(String(formData.get("price") || "").replaceAll(",", ""));
  const tag = String(formData.get("tag") || "New Stock").trim();
  const featured = formData.get("featured") === "true";
  const imageFile = formData.get("image");

  if (!name || !brand || !specs || !Number.isFinite(price) || price <= 0) {
    throw new Error("Invalid phone payload.");
  }

  try {
    const collection = await productsCollection();
    const doc = await collection.findOne({ _id: new ObjectId(id), source: { $ne: "seed" } });
    if (!doc) {
      throw new Error("Product not found.");
    }

    const updates = {
      name,
      brand,
      specs,
      price,
      tag: tag || brand,
      featured,
      updatedAt: new Date(),
    };

    let oldPublicId;
    if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
      const upload = await uploadImage(imageFile);
      updates.image = upload.secure_url;
      updates.cloudinaryPublicId = upload.public_id;
      oldPublicId = doc.cloudinaryPublicId;
    }

    await collection.updateOne({ _id: doc._id }, { $set: updates });

    if (oldPublicId) {
      configureCloudinary();
      await cloudinary.uploader.destroy(oldPublicId).catch(() => null);
    }

    return toProductTuple({ ...doc, ...updates, _id: doc._id });
  } catch (error) {
    throw new Error(formatMongoError(error));
  }
}

export async function deleteProduct(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid product id.");
  }

  try {
    const collection = await productsCollection();
    const doc = await collection.findOne({ _id: new ObjectId(id), source: { $ne: "seed" } });
    if (!doc) {
      throw new Error("Admin product not found.");
    }

    await collection.deleteOne({ _id: doc._id });

    if (doc.cloudinaryPublicId) {
      configureCloudinary();
      await cloudinary.uploader.destroy(doc.cloudinaryPublicId).catch(() => null);
    }
  } catch (error) {
    throw new Error(formatMongoError(error));
  }
}

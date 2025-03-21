import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server.js";
import categoryModel from "../models/categoryModel.js";

let mongoServer;

describe("Category API Integration Tests", () => {

    beforeAll(async () => {
        // Start an in-memory MongoDB server
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        // Ensure mongoose disconnects before reconnecting
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        // Connect Mongoose to the test DB
        await mongoose.connect(mongoUri);
    });

    afterEach(async () => {
        // Restore original implementation of categoryModel after each test 
        jest.restoreAllMocks();
        // Clear all collections after each test
        await categoryModel.deleteMany({});
    });

    afterAll(async () => {
        console.log("Shutting down MongoDB Memory Server...");

        await mongoose.connection.close(); // Close active connection
        await mongoose.disconnect(); // Ensure full disconnection

        if (mongoServer) {
            await mongoServer.stop();
            console.log("MongoDB Memory Server stopped.");
        }
    });

    test("GET /api/v1/category/get-category - should return all categories", async () => {
        // Insert a category into the test database
        await categoryModel.create({ name: "Books", slug: "books" });

        const res = await request(app).get("/api/v1/category/get-category");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.category.length).toBeGreaterThan(0);
        expect(res.body.category[0].name).toBe("Books");
    });

    test("GET /api/v1/category/get-category - should handle errors gracefully", async () => {
        jest.spyOn(categoryModel, "find").mockImplementation(() => {
            throw new Error("Database Error");
        });

        const res = await request(app).get("/api/v1/category/get-category");

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Error while getting all categories");
    })
    
});

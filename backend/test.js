import jwt from "jsonwebtoken";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImthdGhpIiwiaWF0IjoxNzMxNDgyOTkxfQ.-IULFzlYGgVyzXJ6hdphDDpWqcLmAv6ZJvel27Kqp9g";


const decoded = jwt.verify(token, "8d640ec7e423c74eaf4f933e28a0f3be3c34b044f5b50bac054bbedcbbb8d5dc");
console.log(decoded)
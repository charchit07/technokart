const mongoose= require("mongoose")
// Define the Invoice model
const invoiceSchema = new mongoose.Schema({
    invoiceDate: Date,
    invoiceNumber: Number,
    invoiceAmount: Number,
    financialYear: String,
  },
  {
    versionKey:false
  });
  
  const InvoiceModel = mongoose.model('invoice', invoiceSchema);

  module.exports={InvoiceModel}
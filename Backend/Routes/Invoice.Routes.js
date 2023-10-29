const express = require("express");
const { InvoiceModel } = require("../Model/invoice.model");
const invoiceRouter = express.Router();

invoiceRouter.get("/getInvoice/:invoiceNumber", async (req, res) => {
  const { invoiceNumber } = req.params;

  try {
    const invoice = await InvoiceModel.findOne({ invoiceNumber });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve invoice" });
  }
});

// API endpoint to create an invoice
// API endpoint to create an invoice
invoiceRouter.post("/createInvoice", async (req, res) => {
    const { invoiceDate, invoiceNumber, invoiceAmount } = req.body;
  
    // Parse the invoiceDate string to a Date object
    const parsedInvoiceDate = new Date(invoiceDate);

    // Check if the parsed date is a valid Date object
    if (isNaN(parsedInvoiceDate)) {
      return res.status(400).json({ message: "Invalid invoice date format" });
    }
  
    // Find the previous and next invoice in the database
    const previousInvoice = await InvoiceModel.findOne({
      invoiceNumber: invoiceNumber - 1,
    });
    const nextInvoice = await InvoiceModel.findOne({
      invoiceNumber: invoiceNumber + 1,
    });
  
    // Check if the invoice date is within the range of the previous and next invoices
    if (
      (previousInvoice && parsedInvoiceDate < previousInvoice.invoiceDate) ||
      (nextInvoice && parsedInvoiceDate > nextInvoice.invoiceDate)
    ) {
      return res.status(400).json({ message: "Invalid invoice date" });
    }
  
    // Calculate the financial year based on the invoice date
    const year = parsedInvoiceDate.getFullYear();
    const financialYear = `${year}-${year + 1}`;
  
    // Check if an invoice with the same financial year and invoice number exists
    const existingInvoice = await InvoiceModel.findOne({
      financialYear,
      invoiceNumber,
    });
  
    if (existingInvoice) {
      return res
        .status(400)
        .json({ message: "Invoice number already used in this financial year" });
    }
  
    const newInvoice = new InvoiceModel({
      invoiceDate: parsedInvoiceDate,
      invoiceNumber,
      invoiceAmount,
      financialYear,
    });
  
    try {
      await newInvoice.save();
      res.status(201).json(newInvoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to create invoice" });
    }
  })
  

module.exports = { invoiceRouter };

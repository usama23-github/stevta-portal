import { parseExcel } from "./parsers/excel.parser.js";
import { importHierarchy, importStaff } from "./import.service.js";

export const importHierarchyFile = async (req, res) => {
  try {
    const rows = parseExcel(req.file.buffer);

    const result = await importHierarchy(rows);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const importStaffFile = async (req, res) => {
  try {
    const rows = parseExcel(req.file.buffer);

    const result = await importStaff(rows);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};
import { getAllStaff, deleteAllStaffService } from "./staff.service.js";

export const allStaff = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sort = "desc",
      designationId,
      postingPlaceId,
      sectionId,
    } = req.query;

    const result = await getAllStaff({
      page,
      limit,
      search,
      sort,
      designationId,
      postingPlaceId,
      sectionId,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch staff",
    });
  }
};

export const deleteAllStaff = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await deleteAllStaffService(
        req.query.confirm
      );

    return res.status(200).json({
      success: true,
      message:
        "All staff records deleted successfully",
      deletedCount: result.count,
    });
  } catch (error) {
    next(error);
  }
};
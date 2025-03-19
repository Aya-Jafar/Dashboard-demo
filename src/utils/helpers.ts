



export const preprocessNodeID = (id: string) => {
  // Check if the number of "-" in the id is greater than 1
  const parts = id.split("-");
  if (parts.length > 2) {
    return `${parts[0]}-${parts[1]}`; // Return the first section (dept-1)
  }
  return id; // Otherwise, return the id as it is (dept-1)
};

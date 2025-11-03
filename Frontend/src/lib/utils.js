export function formatDate(date){
    return date.toLocaleDateString("en-US",{
        month:"short",
        day:"numeric",
        year:"numeric",
    });
}

export const isImage = (fileName) => {
  if (!fileName) return false;
  const extension = fileName.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
};
const cloudinaryImageLoader = ({ src }) => {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${src}`;
};

export default cloudinaryImageLoader;

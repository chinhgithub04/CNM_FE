import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  },
});

export const buildCloudinaryUrl = (
  imageUrl: string | null | undefined,
  options?: {
    width?: number;
    height?: number;
  }
): string | null => {
  if (!imageUrl) return null;

  let publicId: string;

  if (imageUrl.includes('cloudinary.com')) {
    const urlParts = imageUrl.split('/upload/');
    if (urlParts.length > 1) {
      publicId = urlParts[1];
    } else {
      return imageUrl;
    }
  } else {
    publicId = imageUrl;
  }

  const image = cld.image(publicId);

  if (options?.width && options?.height) {
    image.resize(
      fill().width(options.width).height(options.height).gravity(autoGravity())
    );
  } else if (options?.width) {
    image.resize(fill().width(options.width).gravity(autoGravity()));
  } else if (options?.height) {
    image.resize(fill().height(options.height).gravity(autoGravity()));
  }

  return image.toURL();
};

export const getCategoryThumbnail = (
  imageUrl: string | null | undefined
): string | null => {
  return buildCloudinaryUrl(imageUrl, { width: 384, height: 384 });
};

export const getProductImage = (
  imageUrl: string | null | undefined
): string | null => {
  return buildCloudinaryUrl(imageUrl, { width: 600, height: 600 });
};

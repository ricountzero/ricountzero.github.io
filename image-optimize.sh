#!/bin/bash

# Check for required tools
if ! command -v magick &> /dev/null; then
    echo "Error: ImageMagick is not installed. Please install it with 'sudo apt-get install imagemagick' or similar."
    exit 1
fi

if ! command -v ~/Downloads/libwebp-1.5.0-linux-x86-64/bin/cwebp &> /dev/null; then
    echo "Error: WebP tools are not installed. Please install them with 'sudo apt-get install webp' or similar."
    exit 1
fi

# Create a images-optimized directory
mkdir -p images-optimized

# Define size values
SMALL_WIDTH=480
MEDIUM_WIDTH=768
QUALITY=80

# Function to optimize images
optimize_image() {
    local image=$1
    local filename=$(basename -- "$image")
    local name="${filename%.*}"
    local ext="${filename##*.}"
    
    echo "Processing $filename..."
    
    # Create small version
    magick "$image" -resize "${SMALL_WIDTH}x" -strip -quality $QUALITY "images-optimized/${name}-small.${ext}"
    
    # Create medium version
    magick "$image" -resize "${MEDIUM_WIDTH}x" -strip -quality $QUALITY "images-optimized/${name}-medium.${ext}"
    
    # Create optimized original version
    magick "$image" -strip -quality $QUALITY "images-optimized/${name}.${ext}"
    
    # Convert to WebP (small)
    ~/Downloads/libwebp-1.5.0-linux-x86-64/bin/cwebp -q $QUALITY "images-optimized/${name}-small.${ext}" -o "images-optimized/${name}-small.webp"
    
    # Convert to WebP (medium)
    ~/Downloads/libwebp-1.5.0-linux-x86-64/bin/cwebp -q $QUALITY "images-optimized/${name}-medium.${ext}" -o "images-optimized/${name}-medium.webp"
    
    # Convert to WebP (original size)
    ~/Downloads/libwebp-1.5.0-linux-x86-64/bin/cwebp -q $QUALITY "images-optimized/${name}.${ext}" -o "images-optimized/${name}.webp"
    
    echo "Done with $filename"
}

# Process PNG files
for img in images/*.png; do
    if [ -f "$img" ]; then
        optimize_image "$img"
    fi
done

# Copy SVG files (they're already small and don't need resizing)
for svg in images/*.svg; do
    if [ -f "$svg" ]; then
        cp "$svg" "images-optimized/"
        echo "Copied $svg"
    fi
done

# Create small and medium versions of SVG logo if needed
cp "images/logo.svg" "images-optimized/logo-small.svg"
cp "images/logo.svg" "images-optimized/logo-medium.svg"

echo "Image optimization complete. Files are in the images-optimized directory."
echo "You can now replace your images folder with the optimized versions:"
echo "mv images images-original"
echo "mv images-optimized images" 
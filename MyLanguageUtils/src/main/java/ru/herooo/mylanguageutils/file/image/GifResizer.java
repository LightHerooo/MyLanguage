package ru.herooo.mylanguageutils.file.image;

import ru.herooo.mylanguageutils.file.FileUtils;

import javax.imageio.*;
import javax.imageio.metadata.IIOInvalidTreeException;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.metadata.IIOMetadataNode;
import javax.imageio.stream.FileImageOutputStream;
import javax.imageio.stream.ImageInputStream;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GifResizer {
    private final FileUtils FILE_UTILS = new FileUtils();
    private final ImageResizer IMAGE_RESIZER = new ImageResizer();

    private final String EXTENSION = "gif";

    public File resize(File gif, int size) throws IOException {
        File resizeGif = null;

        if (gif != null && gif.exists()) {
            String fileExtension = FILE_UTILS.getExtension(gif.getName());
            if (fileExtension.equalsIgnoreCase(EXTENSION)) {
                // Разбиваем .gif покадрово
                List<BufferedImage> bis = getGifBufferedImages(gif);
                bis = bis.stream().map(b -> IMAGE_RESIZER.resize(b, size)).toList();

                // Получаем задержку между кадрами
                int delay = getDelay(gif);

                // Генерируем новый .gif
                String newFileName = String.format("%s%s_%s", "r", EXTENSION, gif.getName());
                String newFilePath = FILE_UTILS.getPathWithoutFileName(gif.getPath());
                newFilePath = String.format("%s/%s", newFilePath, newFileName);

                resizeGif = createResizeGif(bis, newFilePath, delay);
                if (resizeGif.exists()) {
                    // Удаляем предыдущий файл
                    gif.delete();
                }
            } else {
                throw new IOException("Файл не является .gif-изображением");
            }
        }

        return resizeGif;
    }

    public List<BufferedImage> getGifBufferedImages(File gif) throws IOException {
        List<BufferedImage> bis = new ArrayList<>();

        ImageReader reader = ImageIO.getImageReadersByFormatName(EXTENSION).next();
        try (ImageInputStream iis = ImageIO.createImageInputStream(gif)) {
            reader.setInput(iis);

            int numberOfImages = reader.getNumImages(true);
            int width = 0;
            int height = 0;
            for (int i = 0; i < numberOfImages; i++) {
                BufferedImage bi = reader.read(i);
                if (i == 0) {
                    width = bi.getWidth();
                    height = bi.getHeight();
                } else if (bi.getWidth() != width && bi.getHeight() != height) {
                    throw new IOException("Некорректное .gif изображение. Выберите другое");
                }

                bis.add(bi);
            }
        }

        return bis;
    }

    private int getDelay(File gif) throws IOException {
        ImageReader reader = ImageIO.getImageReadersByFormatName(EXTENSION).next();
        reader.setInput(ImageIO.createImageInputStream(new FileInputStream(gif.getPath())));

        IIOMetadata imageMetaData =  reader.getImageMetadata(0);
        String metaFormatName = imageMetaData.getNativeMetadataFormatName();

        IIOMetadataNode root = (IIOMetadataNode)imageMetaData.getAsTree(metaFormatName);
        IIOMetadataNode graphicsControlExtensionNode = getNode(root, "GraphicControlExtension");

        String delayStr = graphicsControlExtensionNode.getAttribute("delayTime");
        int delay;
        try {
            delay = Integer.parseInt(delayStr);
        } catch (Throwable e) {
            delay = -1;
        }

        return delay;
    }

    private File createResizeGif(List<BufferedImage> bis, String path, int delay) throws IOException {
        ImageWriter writer = ImageIO.getImageWritersByFormatName(EXTENSION).next();
        ImageWriteParam writeParam = writer.getDefaultWriteParam();
        IIOMetadata metadata = getPreparedMetadata(writer, writeParam, delay);

        File output = new File(path);
        try (FileImageOutputStream fios = new FileImageOutputStream(output)) {
            writer.setOutput(fios);
            writer.prepareWriteSequence(metadata);

            for (BufferedImage bi : bis) {
                IIOImage image = new IIOImage(bi, null, metadata);
                writer.writeToSequence(image, writeParam);
            }

            writer.endWriteSequence();
            writer.dispose();
        }

        return output;
    }

    private IIOMetadata getPreparedMetadata(ImageWriter imageWriter, ImageWriteParam imageWriteParam, int delay) throws IIOInvalidTreeException {
        ImageTypeSpecifier imageTypeSpecifier = ImageTypeSpecifier.createFromBufferedImageType(BufferedImage.TYPE_INT_RGB);
        IIOMetadata metadata = imageWriter.getDefaultImageMetadata(imageTypeSpecifier, imageWriteParam);
        String metaFormatName = metadata.getNativeMetadataFormatName();
        IIOMetadataNode root = (IIOMetadataNode) metadata.getAsTree(metaFormatName);

        IIOMetadataNode graphicsControlExtensionNode = getNode(root, "GraphicControlExtension");
        graphicsControlExtensionNode.setAttribute("disposalMethod", "none");
        graphicsControlExtensionNode.setAttribute("userInputFlag", "FALSE");
        graphicsControlExtensionNode.setAttribute("delayTime", String.valueOf(delay));
        graphicsControlExtensionNode.setAttribute("transparentColorFlag", "FALSE");

        IIOMetadataNode appExtensionsNode = getNode(root, "ApplicationExtensions");
        IIOMetadataNode child = new IIOMetadataNode("ApplicationExtension");
        child.setAttribute("applicationID", "NETSCAPE");
        child.setAttribute("authenticationCode", "2.0");
        child.setUserObject(new byte[]{ 0x1, (byte) (0), (byte) ((0) & 0xFF)});

        appExtensionsNode.appendChild(child);
        metadata.setFromTree(metaFormatName, root);
        return metadata;
    }

    private IIOMetadataNode getNode(IIOMetadataNode rootNode, String nodeName) {
        for (int i = 0; i < rootNode.getLength(); i++) {
            if (rootNode.item(i).getNodeName().equalsIgnoreCase(nodeName)) {
                return (IIOMetadataNode) rootNode.item(i);
            }
        }

        IIOMetadataNode node = new IIOMetadataNode(nodeName);
        rootNode.appendChild(node);
        return node;
    }
}

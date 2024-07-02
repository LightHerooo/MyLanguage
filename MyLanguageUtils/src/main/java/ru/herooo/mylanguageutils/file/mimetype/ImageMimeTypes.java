package ru.herooo.mylanguageutils.file.mimetype;

public enum ImageMimeTypes {
    ALL(new MimeType("image", "*")),
    PNG(new MimeType("image", "png")),
    JPG(new MimeType("image", "jpg")),
    JPEG(new MimeType("image", "jpeg")),
    GIF(new MimeType("image", "gif"))

    ;

    public final MimeType MIME_TYPE;

    ImageMimeTypes(MimeType mimeType) {
        this.MIME_TYPE = mimeType;
    }
}

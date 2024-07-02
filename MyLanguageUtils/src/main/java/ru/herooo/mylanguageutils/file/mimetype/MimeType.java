package ru.herooo.mylanguageutils.file.mimetype;

import ru.herooo.mylanguageutils.StringUtils;

public class MimeType {
    private String title;
    private String type;
    private String format;

    private final StringUtils STRING_UTILS = new StringUtils();

    public MimeType(String type, String format) {
        this.type = type;
        this.format = format;

        if (!STRING_UTILS.isStringVoid(type) && !STRING_UTILS.isStringVoid(format)) {
            this.title = String.format("%s/%s", type, format);
        }
    }

    public MimeType(String title) {
        this.title = title;

        if (!STRING_UTILS.isStringVoid(title)) {
            String[] titleParts = title.split("/");
            if (titleParts.length > 1) {
                this.type = titleParts[0];
                this.format = titleParts[1];
            }
        }
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String createFormatStr() {
        return String.format(".%s", this.format.toUpperCase());
    }
}

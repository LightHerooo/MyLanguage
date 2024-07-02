package ru.herooo.mylanguageutils.file.filesize;

public class FileSize {
    private FileSizeUnits fileSizeUnits;
    private long size;

    public FileSize(FileSizeUnits fileSizeUnits, long size) {
        this.fileSizeUnits = fileSizeUnits;
        this.size = size;
    }

    public String createSizeStr() {
        return String.format("%d%s", size, fileSizeUnits.TITLE);
    }

    public long getNumberOfBytes() {
        return size * fileSizeUnits.NUMBER_OF_BYTES;
    }
}

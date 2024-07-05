package ru.herooo.mylanguageutils.outsidefolder;

import ru.herooo.mylanguageutils.outsidefolder.types.OutsideFolder;
import ru.herooo.mylanguageutils.outsidefolder.types.OutsideImageFolder;

public enum OutsideFolders {
    CUSTOMER_AVATARS(new OutsideImageFolder("/customer/avatars")),
    CUSTOMER_COLLECTION_IMAGES(new OutsideImageFolder("/customer_collection/images"))
    ;

    public final OutsideFolder FOLDER;
    OutsideFolders(OutsideFolder folder) {
        this.FOLDER = folder;
    }
}

package com.devstudio.service;

import com.devstudio.dao.FileManager;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by Vasyl on 02.12.2016.
 */
@Service
public class ImageService {
    FileManager fileManager;
    final static private String TYPE="images";

    public void saveImage(MultipartFile file){
        fileManager.saveFile(file,TYPE);
    }
}

package com.devstudio.restapi;

import com.devstudio.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by Vasyl on 02.12.2016.
 */
@Controller
@RequestMapping("/api/image")
public class ImageController {
    @Autowired
    ImageService imageService;



    @RequestMapping(value="/", method=RequestMethod.POST)
    public @ResponseBody String handleFileUpload(@RequestBody MultipartFile file){
        if (!file.isEmpty()) {
            imageService.saveImage(file);
            return "The file was uploaded";
        }
        else {
            return "The file is empty";
        }
    }
}
  /*  @Resource(mappedName = "fileStorage/basePath")
    private String basePath;*/  // injecting parameter into spring bean
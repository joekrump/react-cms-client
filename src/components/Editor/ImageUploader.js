import AppConfig from '../../../app_config/app'
// Define settings for the uploader 
const CLOUDINARY_PRESET_NAME = AppConfig.CLOUDINARY_PRESET_NAME;
const CLOUDINARY_RETRIEVE_URL = AppConfig.CLOUDINARY_RETRIEVE_URL;
const CLOUDINARY_UPLOAD_URL = AppConfig.CLOUDINARY_UPLOAD_URL;

class ImageUploader {

  constructor(dialog) {
    this.image = null;
    this.xhr = null;
    this.xhrComplete = null;
    this.xhrProgress = null;
    this.dialog = dialog;

    // Set up the event handlers
    this.ialog.addEventListener('imageuploader.cancelupload', this.handleUploadCancel);

    this.dialog.addEventListener('imageuploader.clear', this.handleClearUploader);

    this.dialog.addEventListener('imageuploader.fileready', (ev) => {
      // Upload a file to Cloudinary
      var formData;
      var file = ev.detail().file;

      // Define functions to handle upload progress and completion
      xhrProgress = (ev) => {
        // Set the progress for the upload
        this.dialog.progress((ev.loaded / ev.total) * 100);
      }

      xhrComplete = (ev) => {
        var response;

        // Check the request is complete
        if (ev.target.readyState != 4) {
          return;
        }

        this.resetXHR();

        // Handle the result of the upload
        if (parseInt(ev.target.status) == 200) {
          // Unpack the response (from JSON)
          response = JSON.parse(ev.target.responseText);

          // Store the image details
          this.image = {
            angle: 0,
            height: parseInt(response.height),
            maxWidth: parseInt(response.width),
            width: parseInt(response.width)
          };

          // Apply a draft size to the image for editing
          this.image.filename = this.parseCloudinaryURL(response.url)[0];
          this.image.url = this.buildCloudinaryURL(
            this.image.filename,
            [{c: 'fit', h: 600, w: 600}]
          );
          
          // Populate the dialog
          this.dialog.populate(this.image.url, [this.image.width, this.image.height]);

        } else {
          // The request failed, notify the user
          new ContentTools.FlashUI('no');
        }
      }

      // Set the dialog state to uploading and reset the progress bar to 0
      this.dialog.state('uploading');
      this.dialog.progress(0);

      // Build the form data to post to the server
      formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_PRESET_NAME);

      // Make the request
      this.xhr = new XMLHttpRequest();
      this.xhr.upload.addEventListener('progress', this.xhrProgress);
      this.xhr.addEventListener('readystatechange', this.xhrComplete);
      this.xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);
      this.xhr.send(formData);
    });


    dialog.addEventListener('imageuploader.rotateccw',  () => { 
      this.rotate(-90); 
    });
    dialog.addEventListener('imageUploader.rotatecw', () => { 
      this.rotate(90); 
    });

    dialog.addEventListener('imageuploader.save', this.handleImageSave);
  }


  resetXHR = () => {
    // Clear the request
    this.xhr = null
    this.xhrProgress = null
    this.xhrComplete = null
  }

  handleClearUploader = () => {
    // Clear the current image
      this.dialog.clear();
      this.image = null;
  }

  handleUploadCancel = () => {
    // Cancel the current upload

    // Stop the upload
    if (this.xhr) {
      this.xhr.upload.removeEventListener('progress', this.xhrProgress);
      this.xhr.removeEventListener('readystatechange', this.xhrComplete);
      this.xhr.abort();
    }

    // Set the dialog to empty
    this.dialog.state('empty');
  }

  handleImageSave = () => {
    // Handle a user saving an image
    var cropRegion, cropTransform, imageAttrs, ratio, transforms;
    
    // Build a list of transforms
    transforms = [];
    
    // Angle
    if (this.image.angle != 0) {
      transforms.push({a: image.angle});
    }

    // Crop
    cropRegion = this.dialog.cropRegion();
    if (cropRegion.toString() != [0, 0, 1, 1].toString()) {
      cropTransform = {
        c: 'crop',
        x: parseInt(this.image.width * cropRegion[1]),
        y: parseInt(this.image.height * cropRegion[0]),
        w: parseInt(this.image.width * (cropRegion[3] - cropRegion[1])),
        h: parseInt(this.image.height * (cropRegion[2] - cropRegion[0]))
      };
      transforms.push(cropTransform);

        // Update the image size based on the crop
        this.image.width = cropTransform.w;
        this.image.height = cropTransform.h;
        this.image.maxWidth = cropTransform.w;
      }

    // Resize (the image is inserted in the page at a default size)
    if (this.image.width > 400 || this.image.height > 400) {
      transforms.push({c: 'fit', w: 400, h: 400});

        // Update the size of the image in-line with the resize
        ratio = Math.min(400 / this.image.width, 400 / this.image.height);
        this.image.width *= ratio;
        this.image.height *= ratio;
      }

    // Build a URL for the image we'll insert
    this.image.url = this.buildCloudinaryURL(this.image.filename, transforms);

    // Build attributes for the image
    imageAttrs = {'alt': '', 'data-ce-max-width': this.image.maxWidth};

    // Save/insert the image
    this.dialog.save(this.image.url, [this.image.width, this.image.height]); 
  }

  buildCloudinaryURL(filename, transforms) {
    // Build a Cloudinary URL from a filename and the list of transforms 
    // supplied. Transforms should be specified as objects (e.g {a: 90} becomes
    // 'a_90').
    var i, name, transform, transformArgs, transformPaths, urlParts;

    // Convert the transforms to paths
    transformPaths = [];
    for  (i = 0; i < transforms.length; i++) {
      transform = transforms[i];

        // Convert each of the object properties to a transform argument
        transformArgs = [];
        for (name in transform) {
          if (transform.hasOwnProperty(name)) {
            transformArgs.push(name + '_' + transform[name]);
          }
        }
        
        transformPaths.push(transformArgs.join(','));
      }

    // Build the URL
    urlParts = [CLOUDINARY_RETRIEVE_URL];
    if (transformPaths.length > 0) {
      urlParts.push(transformPaths.join('/'));
    }
    urlParts.push(filename);

    return urlParts.join('/');
  }

  parseCloudinaryURL(url) {
    // Parse a Cloudinary URL and return the filename and list of transforms
    var filename, i, j, transform, transformArgs, transforms, urlParts;

    // Strip the URL down to just the transforms, version (optional) and
    // filename.
    url = url.replace(CLOUDINARY_RETRIEVE_URL, '');

    // Split the remaining path into parts
    urlParts = url.split('/');

    // The path starts with a '/' so the first part will be empty and can be
    // discarded.
    urlParts.shift();

    // Extract the filename
    filename = urlParts.pop();

    // Strip any version number from the URL
    if (urlParts.length > 0 && urlParts[urlParts.length - 1].match(/v\d+/)) {
      urlParts.pop();
    }

    // Convert the remaining parts into transforms (e.g `w_90,h_90,c_fit >
    // {w: 90, h: 90, c: 'fit'}`).
    transforms = [];
    for (i = 0; i < urlParts.length; i++) {
      transformArgs = urlParts[i].split(',');
      transform = {};
      for (j = 0; j < transformArgs.length; j++) {
        transform[transformArgs[j].split('_')[0]] =
        transformArgs[j].split('_')[1];
      }
      transforms.push(transform);
    }

    return [filename, transforms];
  }

  rotate(angle) {
    // Handle a request by the user to rotate the image
    var height, transforms, width;
    
    // Update the angle of the image
    this.image.angle += angle;

    // Stay within 0-360 degree range
    if (this.image.angle < 0) {
      this.image.angle += 360;
    } else if (image.angle > 270) {
      this.image.angle -= 360;
    }

    // Rotate the image's dimensions
    width = this.image.width;
    height = this.image.height;
    this.image.width = height;
    this.image.height = width;
    this.image.maxWidth = width;
    
    // Build the transform to rotate the image
    transforms = [{c: 'fit', h: 600, w: 600}];
    if (this.image.angle > 0) {
      transforms.unshift({a: this.image.angle});
    }

    // Build a URL for the transformed image
    this.image.url = this.buildCloudinaryURL(this.image.filename, transforms);
    
    // Update the image in the dialog
    dialog.populate(this.image.url, [this.image.width, this.image.height]);
  }
}

export default ImageUploader
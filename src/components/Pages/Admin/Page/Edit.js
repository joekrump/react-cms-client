import React from 'react'
// import DraftEditor from '../../../Editor/DraftEditor'
// import {RichEditor} from 'draft-note-editor'

// import '../../../Editor/css/Draft.css';
// import '../../../Editor/css/RichEditor.css';

import Editor from "./ProseMirror/Editor"

const Edit = () => ({
  
	render() {
		return (
			<Editor initContent="<h1>Test</h1>" />
		)
		
	}
});

export default Edit;

// Usage:
// pm.on("drop", dropHandler(pm))

export function dropHandler (pm) {
  return function (e) {
    if(!(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0))
      return

    let images = filterImages(e.dataTransfer.files)
    if(images.length === 0) return

    e.preventDefault()
    let insertPos = pm.posAtCoords({left: e.clientX, top: e.clientY})
    let nodes = []
    images.forEach(image => {
      let reader = new FileReader()
      reader.onload = e => {
        scaleImage(e.target.result, getWidth(pm.content), img => {
          nodes.push(pm.schema.node("image", {src: img.src, alt: image.name}))
          if(nodes.length === images.length)
            pm.tr.insert(insertPos, nodes).apply()
        })
      }
      reader.readAsDataURL(image)
    })
  }
}

function filterImages (files) {
  let images = []
  for(let i = 0; i < files.length; i++) {
    let file = files[i]
    if (!(/image/i).test(file.type)) continue
    images.push(file)
  }
  return images
}

function getWidth (el) {
  let width = ('getComputedStyle' in window)
    ? window.getComputedStyle(el).getPropertyValue('width')
    : el.currentStyle.width

  return parseInt(width, 10)
}

function scaleImage (src, targetWidth, callback) {
  let img = document.createElement("img")
  img.src = src
  img.style.visibility = "hidden"
  document.body.appendChild(img)

  let canvas = document.createElement("canvas")
  let ctx = canvas.getContext("2d")

  img.onload = e => {
    if(img.width <= targetWidth) {
      document.body.removeChild(img)
      return callback(img)
    }

    let newWidth = Math.floor(img.width / 2)

    if(newWidth < targetWidth)
      newWidth = targetWidth

    let newHeight = Math.floor(img.height / img.width * newWidth)

    if(newWidth >= targetWidth) {
      canvas.width = newWidth
      canvas.height = newHeight

      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      img.src = canvas.toDataURL()
      img.width = newWidth
    }
  }
}
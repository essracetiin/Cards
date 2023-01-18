import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Card, CardBody, CardTitle, Input } from "reactstrap";
import { Button } from "@mui/material";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./Card.css";

export default function AddCard() {
  const [description, setDescription] = useState("");
  const [card, setCard] = useState([]);
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  console.log("cards", card);
  const cardCollectionRef = collection(db, "cards");
  const [percent, setPercent] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const createCard = async () => {
    const storageRef = ref(storage, `/files/${images[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, images[0]);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
        setIsUploading(true);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          addDoc(cardCollectionRef, {
            description: description,
            url,
          });
          getCard();
          setIsUploading(false);
          setImages([]);
          setImageURLs([]);
          setDescription("");
          setTitle("New Title");
        });
      }
    );
  };
  const getCard = async () => {
    const data = await getDocs(cardCollectionRef);
    setCard(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  useEffect(() => {
    getCard();
  }, []);
  const [title, setTitle] = useState("New Title");
  const changeTitle = (title) => {
    setTitle(title);
  };

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
    setImageURLs(newImageUrls);
  }, [images]);
  console.log("images : ");

  const onImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <div>
      <Card
        body
        color="dark"
        outline
        style={{
          width: "20rem",
          height: "33rem",
          margin: "4rem",
          borderRadius: "1rem",
        }}
      >
        <CardBody>
          <CardTitle
            className="text-left"
            onClick={() => changeTitle("Hello World")}
            tag="h5"
            style={{ color: "#e9967a" }}
          >
            {title}
          </CardTitle>
          <Input
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            style={{ width: "285px", marginLeft: "-16px", height: "160px" }}
            type="textarea"
            placeholder="New description"
          />
        </CardBody>
        <div className="upload">
          {images.length === 0 && (
            <svg
              width="95px"
              height="95px"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              stroke="#000000"
              stroke-width="0.00048000000000000007"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path d="M0 0h48v48H0z" fill="none"></path>{" "}
                <g id="Shopicon">
                  {" "}
                  <polygon points="26,8 22,8 22,22 8,22 8,26 22,26 22,40 26,40 26,26 40,26 40,22 26,22 "></polygon>{" "}
                </g>{" "}
              </g>
            </svg>
          )}
          <input
            className="uploadInput"
            type="file"
            onChange={onImageChange}
            width="318px"
            height="220px"
          />
          {imageURLs.map((imageSrc) => (
            <img src={imageSrc} width="318px" height="220px" />
          ))}
        </div>
        <div className="button">
          <Button
            disabled={isUploading}
            onClick={createCard}
            variant="contained"
            color="success"
            style={{
              width: "35px",
              height: "35px",
              marginTop: "15px",
              borderRadius: "0px",
            }}
          >
            {percent && percent != 100 ? `% ${percent}` : ""}
          </Button>
        </div>
      </Card>
      {card.map((x) => (
        <Card
          src={x.card}
          body
          color="secondary"
          outline
          style={{
            borderWidth: "0.09rem",
            width: "20rem",
            height: "30rem",
            margin: "4rem",
            borderRadius: "1rem",
          }}
        >
          <CardTitle
            className="text-left"
            tag="h5"
            style={{ color: "#e9967a" }}
          >
            Hello World
          </CardTitle>
          <p className="description">{x.description}</p>

          <img className="image" src={x.url} />
        </Card>
      ))}
    </div>
  );
}

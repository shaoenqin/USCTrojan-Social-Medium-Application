import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
  SettingsInputSvideoRounded,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useRef, useState, useEffect} from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share({ setPosts }) {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const tags = useRef();
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [userchange, setUserchange] = useState(false);


  useEffect(() => {
    
    setUserchange(true);
   }, [user]);
   
  const submitHandler = async (e) => {
    e.preventDefault();
    let tagsArr = [];
    tagsArr = tags.current.value.split(",");
    let newArr = tagsArr.map(val => val.toLowerCase().trim())
    const newPost = {
      userId: user._id,
      userName: user.username,
      desc: desc.current.value,
      tags: newArr
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      console.log(newPost);
      try {
        await axios.post("/upload", data);
      } catch (err) { }
    }
    try {
      const res = await axios.post("/posts", newPost);
      console.log(res);
      setPosts(prevPosts => {
        return [res.data, ...prevPosts]
      });
      desc.current.value = null;
      tags.current.value = null;
      setFile(null);
      //window.location.reload();
      // 1. Notify Feed to refresh
      // 2. Motify User model to re-fetch data from server
    } catch (err) { }
  };



  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
        <Link to={`/profile/${user.username}`}>
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          </Link>
          <form className="shareForm">
            <input
              placeholder={"Hi " + user.username + ", what's happening?"}
              className="shareInput"
              ref={desc}
            />
            <div className="shareOption">
              <Label htmlColor="#fee682" className="shareIcon" />
              <input
                placeholder={"# tags (comma is a must): weather, mood, study, travel, cat, ..."}
                type="text"
                className="tagInput"
                ref={tags}
                autoComplete="text"
              />
            </div>
          </form>
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            {/* <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>  
            </div> */}
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getAlbums, updateAlbum, deleteAlbum, createAlbum } from "../api";
import toast from "react-hot-toast";
import "../styles/Home.css";

const Home = () => {
  const [newAlbum, setNewAlbum] = useState("");
  const [albums, setAlbums] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [albumTitle, setAlbumTitle] = useState("");
  const [processing, setProcessing] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);

  useEffect(() => {
    const fetchAlbums = async () => {
      const albums = await getAlbums();
      if (albums.success) {
        setAlbums(albums.data);
      }
    };
    fetchAlbums();
  }, []);

  const editAlbum = (index) => {
    setEdit(!edit);
    setEditIndex(index);
    setAlbumTitle(albums[index].title);
  };

  const updateAlbumState = async (e, id, index) => {
    if (e.key === "Enter" && !processing) {
      setProcessing(true);
      const newAlbum = e.target.value;
      const response = await updateAlbum(newAlbum, id);
      if (response.success) {
        albums[index].title = newAlbum;
        setEdit(false);
      } else {
        toast.error("Error while updating Album");
        console.log(response);
      }
      setProcessing(false);
    }
  };

  const deleteAlbumState = async (id, index) => {
    setProcessing(true);
    setDeleteIndex(index);
    const response = await deleteAlbum(id);
    if (response.success) {
      const newAlbums = albums.filter((album) => album.id !== id);
      setAlbums(newAlbums);
      // albums.splice(index, 1);
      // console.log(albums);
      // setAlbums(albums);
    } else {
      toast.error("Error while deleting Album");
      console.log(response);
    }
    setProcessing(false);
    setDeleteIndex(-1);
  };

  return (
    <>
      <div className="create-album">
        <input
          type="text"
          placeholder="Create New Album..."
          value={newAlbum}
          onChange={(e) => setNewAlbum(e.target.value)}
        />
        <button onClick={addAlbum}>Add Album</button>
      </div>

      <div className="albums">
        {albums.map((album, index) => (
          // <div className="album">
          <div className="album-detail" key={`album-${index}`}>
            {edit && editIndex === index ? (
              <input
                type="text"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                onKeyDown={(e) => {
                  updateAlbumState(e, album.id, index);
                }}
              />
            ) : processing && deleteIndex === index ? (
              <span className="album-title-delete">deleting.....</span>
            ) : (
              <span className="album-title">{album.title}</span>
            )}
            <div className="album-action">
              {/* <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
              alt=""
            />

            <img
              src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"
              alt=""
            /> */}
              <i
                className="fa-solid fa-pencil"
                onClick={() => editAlbum(index)}
              ></i>
              <i
                className="fa-solid fa-trash-can"
                onClick={() => deleteAlbumState(album.id, index)}
              ></i>
            </div>
          </div>
          // </div>
        ))}
      </div>
    </>
  );
};

export default Home;

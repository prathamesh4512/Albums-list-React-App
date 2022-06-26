import { useEffect, useState } from "react";
import { getAlbums, updateAlbum, deleteAlbum, createAlbum } from "../api";
import toast from "react-hot-toast";
import "../styles/Home.css";

const Home = () => {
  const [newAlbum, setNewAlbum] = useState("");
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  const editAlbum = (id, index) => {
    if (edit && editIndex === id) {
      return setEdit(false);
    } else if (edit) {
      setEditIndex(id);
      return setAlbumTitle(albums[index].title);
    }

    setEdit(true);
    setEditIndex(id);
    setAlbumTitle(albums[index].title);
  };

  const updateAlbumState = async (e, id, index) => {
    if (e.key === "Enter" && !processing) {
      setProcessing(true);
      const newAlbum = e.target.value;
      const response = await updateAlbum(newAlbum, id);
      if (response.success) {
        albums.find((album) => album.id === id).title = newAlbum;
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
    setDeleteIndex(id);
    const response = await deleteAlbum(id);
    if (response.success) {
      const newAlbums = albums.filter((album) => album.id !== id);
      setAlbums(newAlbums);
      toast.success("Album deleted Successfully");
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

  const addAlbum = async () => {
    if (!newAlbum) return toast.error("Cant add empty Album");
    // let id = albums.length + 1;;
    const newAlbumObj = {
      userId: 11,
      // id:id,
      id: 100,
      title: newAlbum,
    };
    const response = await createAlbum(newAlbumObj);
    if (response.success) {
      setNewAlbum("");
      const newAlbums = [newAlbumObj, ...albums];
      setAlbums(newAlbums);
      toast.success("New Album added Successfully");
    } else {
      console.log(response);
    }
  };

  return (
    <>
      <div className="create-album">
        <textarea
          placeholder="Create New Album..."
          value={newAlbum}
          onChange={(e) => setNewAlbum(e.target.value)}
        />
        <button onClick={addAlbum}>Add Album</button>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="albums">
          {albums.map((album, index) => (
            // <div className="album">
            <div className="album-detail" key={`album-${index}`}>
              {processing && deleteIndex === album.id ? (
                <span className="album-title-delete">deleting.....</span>
              ) : edit && editIndex === album.id ? (
                <input
                  type="text"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  onKeyDown={(e) => {
                    updateAlbumState(e, album.id, index);
                  }}
                />
              ) : (
                <span
                  className="album-title"
                  onClick={() => editAlbum(album.id, index)}
                >
                  {album.title}
                </span>
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
                  onClick={() => editAlbum(album.id, index)}
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
      )}
    </>
  );
};

export default Home;

import { useEffect, useState } from "react";
import { getAlbums, updateAlbum, deleteAlbum, createAlbum } from "../api";
import toast from "react-hot-toast";
import "../styles/Home.css";

const Home = () => {
  const [newAlbum, setNewAlbum] = useState("");
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(-1);
  const [albumTitle, setAlbumTitle] = useState("");
  const [processing, setProcessing] = useState(false);
  const [deleteId, setDeleteId] = useState(-1);

  // Fetching albums from api on mount
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

  //clicking on pencil
  const editAlbum = (id, index) => {
    // if we click on same album pencil twice
    if (edit && editId === id) {
      return setEdit(false);
      // if we had previously clicked on a album pencil & now clicked on
      // another album pencil
    } else if (edit) {
      setEditId(id);
      return setAlbumTitle(albums[index].title);
    }

    // if we are clicking on pencil for 1st time OR
    // no pencil buttom is active
    setEdit(true);
    setEditId(id);
    setAlbumTitle(albums[index].title);
  };

  const updateAlbumState = async (e, id, index) => {
    // if user clicked enter twice then !processing will be false
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

  const deleteAlbumState = async (id) => {
    setProcessing(true);
    // for showing deleting.... on UI for the deleting album
    setDeleteId(id);
    const response = await deleteAlbum(id);
    if (response.success) {
      const newAlbums = albums.filter((album) => album.id !== id);
      setAlbums(newAlbums);
      toast.success("Album deleted Successfully");
    } else {
      toast.error("Error while deleting Album");
      console.log(response);
    }
    setProcessing(false);
    setDeleteId(-1);
  };

  const addAlbum = async () => {
    if (!newAlbum) return toast.error("Cant add empty Album");
    // creating album obj for snding it to api
    // let id = albums.length + 1;;
    const newAlbumObj = {
      userId: 11,
      // id:id,
      id: 100,
      title: newAlbum,
    };
    const response = await createAlbum(newAlbumObj);
    if (response.success) {
      // making textarea blank after clicking on add album
      setNewAlbum("");
      const newAlbums = [newAlbumObj, ...albums];
      setAlbums(newAlbums);
      toast.success("New Album added Successfully");
    } else {
      toast.error("Error in creating new Album");
      // console.log(response);
    }
  };

  // const addAlbumViaEnter = (e) => {
  //   if (e.key === "Enter") addAlbum();
  // };

  return (
    <>
      <div className="create-album">
        <textarea
          placeholder="Create New Album..."
          value={newAlbum}
          onChange={(e) => setNewAlbum(e.target.value)}
          // onKeyDown={addAlbumViaEnter}
        />
        <button onClick={addAlbum}>Add Album</button>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="albums">
          {albums.map((album, index) => (
            <div className="album-detail" key={`album-${index}`}>
              {processing && deleteId === album.id ? (
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
                <i
                  className="fa-solid fa-pencil"
                  onClick={() => editAlbum(album.id, index)}
                ></i>
                <i
                  className="fa-solid fa-trash-can"
                  onClick={() => deleteAlbumState(album.id)}
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

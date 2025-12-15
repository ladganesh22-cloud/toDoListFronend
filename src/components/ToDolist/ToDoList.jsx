import { useState, useEffect } from 'react';
import useFetchToDoList from "../../hooks/useFetchToDoList";



const ToDoList = () => {
  // fetch to-do list data using custom hook

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editData, setEditData] = useState({
    _id: "",
    title: "",
    description: "",
    completed: "",
    feedback: "",
  });


  const {
    toDoList,
    singleToDo,
    loading,
    error,
    getAllToDoList,
    getTODoListsById,
    createToDoList,
    deleteToDoLists,
    updateToDoLists,
  } = useFetchToDoList();

  console.log(toDoList, loading, error);



  const handleCreateToDoLists = () => {
    console.log("Creating ToDoList:", { title, description });
    createToDoList({
      data: {
        title,
        description,
      }
    });
    setTitle("");
    setDescription("");
  };

  const handleSearchToDoLists = async () => {
    console.log("Searching for:", search);
    if (search.trim().length === 0) {
      setNoResult(false);
      setIsSearchMode(false);
      getAllToDoList();
    }

    const fullToDoList = toDoList;

    const foundList = fullToDoList.find(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
    console.log("Found List:", foundList);
    if (foundList) {
      setNoResult(false);
      setIsSearchMode(true);
      await getTODoListsById(foundList._id);
    }
    else {
      // alert("No matching task found!");
      setIsSearchMode(false);
      setNoResult(true);
    }
  };

  const handleEditOpen = (todo) => {
    setEditData({
      _id: todo._id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      feedback: todo.feedback || "",
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async () => {
    const payload = {
      title: editData.title,
      description: editData.description,
      completed: editData.completed,
      feedback: editData.feedback,
    };

    await updateToDoLists(editData._id, payload);
    setIsEditOpen(false);
  };


  if (loading) {
    return (
      <div className="bg-amber-200  text-white flex justify-center items-center h-screen align-middle">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-amber-200  text-white flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold">Error: {error}</h2>
      </div>
    );
  }



  return (
    <div className="bg-yellow-50 p-10 m-auto w-6xl rounded-lg shadow-2xl flex flex-col text-align-center">
      <h1 className="w-100 m-auto text-align-center text-2xl font-bold p-2 mb-4 bg-blue-900 rounded-lg text-white flex justify-center">To-Do List</h1>

      <div className="flex justify-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Search Task..."
          className="border p-2 rounded w-75 border-blue-900"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleSearchToDoLists}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
        >
          Search
        </button>
      </div>

      <div className="w-100 m-auto justify-center max-w-lg bg-blue-100 p-5 rounded-lg shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">New Task</h2>

        <input
          className="border p-2 w-full rounded mb-3"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full rounded mb-3"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold w-full"
          onClick={handleCreateToDoLists}
        >
          ADD TASK
        </button>
      </div>

      <div className="w-full m-auto max-w-6xl">
        <table className="table-auto w-full border border-blue-300 text-center shadow-lg">
          <thead className="bg-blue-200">
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Feedback</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {noResult ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-red-600 font-semibold">
                  No result found.
                </td>
              </tr>
            ) :
              isSearchMode && singleToDo ? (
                <tr key={singleToDo._id}>
                  <td className="border px-4 py-2">{singleToDo.title}</td>
                  <td className="border px-4 py-2">{singleToDo.description}</td>
                  <td className="border px-4 py-2">
                    <select
                      value={singleToDo.completed}
                      onChange={(e) => {
                        const value = e.target.value;

                        const payload = {
                          completed: value,
                          feedback: value === "Approved" ? "Good Job" : ""
                        };
                        console.log("Updating singleToDo:", singleToDo._id, payload);
                        updateToDoLists(singleToDo._id, payload);
                      }}
                    >
                      <option value="Rejected">Rejected</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">{singleToDo.feedback}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleEditOpen(singleToDo)}
                    >
                      Edit
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={async () => {
                        await deleteToDoLists(singleToDo._id);
                        setIsSearchMode(false);
                      }}
                    >Delete
                    </button>
                  </td>
                </tr>
              ) : toDoList.length > 0 ? (
                toDoList.map((each) => (
                  <tr key={each._id}>
                    <td className="border px-4 py-2">{each.title}</td>
                    <td className="border px-4 py-2">{each.description}</td>
                    <td className="border px-4 py-2">
                      <select
                        className="border p-1 rounded"
                        value={each.completed}
                        onChange={(e) => {
                          const value = e.target.value;

                          const payload = {
                            completed: value,
                            feedback: value === "Approved" ? "Good Job" : ""
                          };

                          updateToDoLists(each._id, payload);
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="border px-4 py-2">{each.feedback}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                        onClick={() => handleEditOpen(each)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => deleteToDoLists(each._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No To-Do items found.
                  </td>
                </tr>
              )}
          </tbody>

        </table>
        {isEditOpen && (
          <div className="fixed inset-0 bg-amber-400 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-6">

              <h2 className="text-xl font-bold mb-4 text-center text-blue-800">
                Edit To-Do Task
              </h2>

              <input
                className="border p-2 w-full rounded mb-3"
                placeholder="Title"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />

              <textarea
                className="border p-2 w-full rounded mb-3"
                placeholder="Description"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />

              <select
                className="border p-2 w-full rounded mb-3"
                value={editData.completed}
                onChange={(e) =>
                  setEditData({ ...editData, completed: e.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <input
                className="border p-2 w-full rounded mb-4"
                placeholder="Feedback"
                value={editData.feedback}
                onChange={(e) =>
                  setEditData({ ...editData, feedback: e.target.value })
                }
              />

              <div className="flex justify-end gap-3">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                  onClick={handleEditSubmit}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDoList;

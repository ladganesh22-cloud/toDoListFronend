import { useState, useEffect } from 'react';
import useFetchToDoList from "../../hooks/useFetchToDoList";



const ToDoList = () => {
  // fetch to-do list data using custom hook

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

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
      setIsSearchMode(false);
      getAllToDoList();
    }

    const fullToDoList = toDoList;

    const foundList = fullToDoList.find(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
    console.log("Found List:", foundList);
    if (foundList) {
      setIsSearchMode(true);
      await getTODoListsById(foundList._id);
    }
    else {
      alert("No matching task found!");
    }
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

      <div className="w-full m-auto max-w-4xl">
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
            {isSearchMode && singleToDo ? (
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
      </div>

      {/* <input
        className="border p-2"
        placeholder="Add title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button className="btn bg-yellow-300 text-white font-bold p-5 m-5" onClick={handleCreateToDoLists}>Add</button>
      <table className="table-auto w-100 border-collapse border border-gray-300">
        <tbody>
          {toDoList.map((each) => (
            <tr key={each._id}>
              <td>{each.title}</td>
              <td>
                <select
                  value={each.completed}
                  onChange={(e) => updateToDoLists(each._id, e.target.value)}
                >
                  <option value="rejected">Rejected</option>
                  <option value="Approved">Approved</option>
                </select>
              </td>
              <td>
                <button onClick={() => deleteToDoLists(each._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default ToDoList;

import { useState, useEffect } from 'react';
import useFetchTaskItem from '../../hooks/useFetchTaskItem';



const TaskItem = () => {
  // fetch task Item data using custom hook

  const [tasktxt, setTaskTxt] = useState("");
  const [taskdesc, setTaskDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [nofinding, setNoFinding] = useState(false);
  const [editUpdate, setEditOpen] = useState(false);

  const [selectTaskData, setselectTaskData] = useState({
    _id: "",
    tasktxt: "",
    taskdesc: "",
    completed: "",
    feedback: "",
  });


  const {
    taskItem,
    taskDetails,
    fetching,
    failed,
    getAllTaskItemLists,
    getTaskItemsById,
    createTaskItemList,
    updateTaskItemList,
    deleteTaskItemLists,
  } = useFetchTaskItem();

  console.log(taskItem, taskDetails, fetching, failed);
  console.log('taskItemList, loading, error');



  const handleCreateTaskItemLists = () => {
    console.log("Creating TaskItemList:", { tasktxt, taskdesc });
    createTaskItemList({
      data: {
        title: tasktxt,
        description: taskdesc,
      }
    });
    setTaskTxt("");
    setTaskDesc("");
  };

  const handleSearchTaskItemLists = async () => {
    console.log("Searching for:", searchQuery);
    if (searchQuery.trim().length === 0) {
      setNoFinding(false);
      setIsSearchMode(false);
      getAllTaskItemLists();
    }

    const fullTaskItemList = taskItem;
    console.log(fullTaskItemList, 'fullTaskItemListfullTaskItemListfullTaskItemListfullTaskItemList');
    const foundList = fullTaskItemList.find(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("Found List:", foundList);
    if (foundList) {
      setNoFinding(false);
      setIsSearching(true);
      await getTaskItemsById(foundList._id);
    }
    else {
      // alert("No matching task found!");
      setIsSearching(false);
      setNoFinding(true);
    }
  };

  const handleEditOpen = (todo) => {
    console.log(todo, 'tododododo');
    setselectTaskData({
      _id: todo._id,
      tasktxt: todo.title,
      taskdesc: todo.description,
      completed: todo.completed,
      feedback: todo.feedback || "",
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    const payload = {
      title: selectTaskData.tasktxt,
      description: selectTaskData.taskdesc,
      completed: selectTaskData.completed,
      feedback: selectTaskData.feedback,
    };
    console.log(payload, 'payload12');
    console.log(selectTaskData._id, 'selectTaskData._id');
    await updateTaskItemList(selectTaskData._id, payload);
    setEditOpen(false);
  };


  if (fetching) {
    return (
      <div className="bg-blue-200 text-white flex justify-center items-center h-screen align-middle">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }


  // if (fetching) {
  //   return (
  //     <div className="text-center h-screen align-middle">
  //       <h2 className="text-xl font-semibold">Loading...</h2>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="bg-blue-200  text-white flex justify-center items-center h-screen">
  //       <h2 className="text-xl font-semibold">Error: {error}</h2>
  //     </div>
  //   );
  // }

  if (failed) {
    return (
      <div className="bg-blue-200  text-white flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold">Error: {failed}</h2>
      </div>
    );
  }



  return (
    // <div className="bg-blue-50 flex flex-col text-align-center">
    //   <h1 className="w-100 m-auto text-align-center text-2xl font-bold p-2 mb-4 bg-blue-900 rounded-lg text-white flex justify-center">To-Do List</h1>

    //     <button
    //       onClick={handleSearchToDoLists}
    //       className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
    //     >
    //       Search
    //     </button>
    //   </div>
    <div className="bg-blue-50 p-10 m-auto w-6xl rounded-lg shadow-2xl flex flex-col text-align-center">
      <h1 className="w-100 m-auto text-align-center text-2xl font-bold p-2 mb-4 bg-blue-900 rounded-lg text-white flex justify-center">Task Assignment Dashboard</h1>

      <div className="flex justify-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Search Task..."
          className="border p-2 rounded w-75 border-blue-900"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearchTaskItemLists}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
        >
          Search
        </button>
      </div>
      {/*
      <div className="w-100 m-auto justify-center max-w-lg bg-blue-100 p-5 rounded-lg shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">New Task</h2>

        <input
          className="border p-2 w-full rounded mb-3"
          placeholder="Enter tasktxt"
          value={tasktxt}
          onChange={(e) => settasktxt(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold w-full"
          onClick={handleCreateTaskItemLists}
        >
          ADD TASK
        </button>
      </div> */}


      <div className="w-100 m-auto justify-center max-w-lg bg-blue-100 p-5 rounded-lg shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">New Task</h2>

        <input
          className="border p-2 w-full rounded mb-3"
          placeholder="Enter tasktxt"
          value={tasktxt}
          onChange={(e) => setTaskTxt(e.target.value)}
        />

        <textarea
          className="border p-2 w-full rounded mb-3"
          placeholder="Enter taskdesc"
          value={taskdesc}
          onChange={(e) => setTaskDesc(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold w-full"
          onClick={handleCreateTaskItemLists}
        >
          ADD TASK
        </button>
      </div>
      <div className="w-full m-auto max-w-6xl">
        <table className="table-auto w-full border border-blue-300 text-center shadow-lg">
          <thead className="bg-blue-200">
            <tr>
              <th className="border px-4 py-2">Assignment Name</th>
              <th className="border px-4 py-2">Assignement Decription</th>
              <th className="border px-4 py-2">Progress</th>
              <th className="border px-4 py-2">Feedback</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {nofinding ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-red-600 font-semibold">
                  No result task item found.
                </td>
              </tr>
            ) :
              isSearching && taskDetails ? (
                <tr key={taskDetails._id}>
                  <td className="border px-4 py-2">{taskDetails.title}</td>
                  <td className="border px-4 py-2">{taskDetails.description}</td>
                  <td className="border px-4 py-2">
                    <select
                      value={taskDetails.completed}
                      onChange={(e) => {
                        const value = e.target.value;

                        const payload = {
                          completed: value,
                          feedback: value === "Approved" ? "Good Job" : ""
                        };
                        console.log("Updating singleToDo:", taskDetails._id, payload);
                        updateTaskItemList(taskDetails._id, payload);
                      }}
                    >
                      <option value="Rejected">Rejected</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">{taskDetails.feedback}</td>
                  {/* <td className="border px-4 py-2">
                    <button
                      className="bg-blue-900 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleEditOpen(taskDetails)}
                    >
                      Edit
                    </button>
                  </td> */}
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-900 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleEditOpen(taskDetails)}
                    >
                      Edit
                    </button>
                    <button className="bg-red-700 text-white px-3 py-1 rounded"
                      onClick={async () => {
                        await deleteToDoLists(taskDetails._id);
                        setIsSearchMode(false);
                      }}
                    >Delete
                    </button>
                  </td>
                </tr>
              ) : taskItem.length > 0 ? (
                taskItem.map((each) => (
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

                          updateTaskItemList(each._id, payload);
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
                        className="bg-blue-900 text-white px-3 py-1 rounded mr-2"
                        onClick={() => handleEditOpen(each)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-700 text-white px-3 py-1 rounded"
                        onClick={() => deleteTaskItemLists(each._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No Task items found.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
        {editUpdate && (
          <div className=" justify-center  items-center z-50 fixed inset-0 bg-green-400 bg-opacity-50 flex">
            <div className=" max-w-lg rounded-lg shadow-xl p-6  bg-white w-full">
              <h3 className="text-center text-red-800 text-xl font-bold  mb-4  ">Update Task Dashboard</h3>
              {/* Get Task Test Input Elements */}
              <input className="w-full rounded mb-3  border p-2 " placeholder="Task Text...." value={selectTaskData.tasktxt} onChange={(e) => setselectTaskData({ ...selectTaskData, tasktxt: e.target.value })} />
              {/* Get Task Desciption Testarea Elements */}
              <textarea className="w-full rounded mb-3 border p-2 " placeholder="Task Description....." value={selectTaskData.taskdesc} onChange={(e) => setselectTaskData({ ...selectTaskData, taskdesc: e.target.value })} />
              {/* Get Task Select Progress Select Options Elements */}
              <select className="mb-3  border p-2 w-full rounded " value={selectTaskData.completed} onChange={(e) => setselectTaskData({ ...selectTaskData, completed: e.target.value })}>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              {/* Get Task Select Progress Select Options Elements */}
              <input className="border p-2 w-full rounded mb-4" placeholder="Task Feedback ...." value={selectTaskData.feedback} onChange={(e) => setselectTaskData({ ...selectTaskData, feedback: e.target.value })} />
              {/* Get Task Select Progress Select Options Elements */}
              <div className="flex justify-end gap-3">
                <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditOpen(false)}>Cancel</button>
                <button className="bg-green-800 text-white px-4 py-2 rounded font-semibold" onClick={handleEditSubmit}>Update</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;

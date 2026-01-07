import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://todolistbackend-yrq1.onrender.com/todolists';

const useFetchTaskItem = () => {
  const [taskItem, setTaskItem] = useState([]);
  const [taskDetails, settaskDetails] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [failed, setFailed] = useState(null);

  const startRequest = () => {
    setFailed(null);
    setFetching(true);
  };

  // Get All Task-Item LISTS
  const getAllTaskItemLists = async () => {
    try {
      startRequest();

      const res = await axios.get(API_URL);

      console.log(res)

      console.log(res.data)

      setTaskItem(res.data.data);
    } catch (err) {
      console.log(err);

      setFailed(err.message);

    } finally {
      setFetching(false);
    }
  };

  // get Task Items LIST BY ID
  const getTaskItemsById = async (id) => {
    try {

      startRequest();

      const res = await axios.get(`${API_URL}/${id}`);

      console.log(res);
      console.log(res.data);
      settaskDetails(res.data.data);
    } catch (err) {
      setFailed(err.message);
    } finally {
      setFetching(false);
    }
  };

  // CREATE NEW Task Item LIST
  const createTaskItemList = async (taskData) => {
    try {
      startRequest();

      const res = await axios.post(API_URL, taskData);
      console.log(res, 'res');
      // console.log(res);
      await getAllTaskItemLists();
      return res.data;
    } catch (err) {
      console.log(err, 'rreerrree');
      setFailed(err.message);
    } finally {
      setFetching(false);
    }
  };

  // update Task Item List LIST BY ID
  const updateTaskItemList = async (id, updatedData) => {
    try {
      startRequest();

      const res = await axios.put(`${API_URL}/${id}`, {
        data: updatedData
      });


      console.log(res, 'reessssssssssssss');

      await getAllTaskItemLists();
      if (settaskDetails) {
        settaskDetails(res.data.data);
      }
      return res.data;
    } catch (err) {
      console.log('errrrrrrrr')
      setFailed(err.message);
    } finally {
      setFetching(false);
    }
  };

  // DELETE Task ITEMS LIST BY ID
  const deleteTaskItemLists = async (id) => {
    try {
      startRequest();

      const res = await axios.delete(`${API_URL}/${id}`);

      await getAllTaskItemLists();
    } catch (err) {
      console.log('errer_delete');
      setFailed(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getAllTaskItemLists();
  }, []);


  return {
    taskItem,
    taskDetails,
    fetching,
    failed,
    getAllTaskItemLists,
    getTaskItemsById,
    createTaskItemList,
    updateTaskItemList,
    deleteTaskItemLists,
  };
};

export default useFetchTaskItem;

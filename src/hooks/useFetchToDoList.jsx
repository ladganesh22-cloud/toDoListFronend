import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://todolistbackend-yrq1.onrender.com/todolists';

const useFetchToDoList = () => {
  const [toDoList, setToDoList] = useState([]);
  const [singleToDo, setSingleToDo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startRequest = () => {
    setError(null);
    setLoading(true);
  };

  // Get All TO-DO LISTS
  const getAllToDoList = async () => {
    try {
      startRequest();
      const res = await axios.get(API_URL);
      setToDoList(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // get TODO LIST BY ID
  const getTODoListsById = async (id) => {
    try {
      startRequest();
      const res = await axios.get(`${API_URL}/${id}`);
      setSingleToDo(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // CREATE NEW TODO LIST
  const createToDoList = async (taskData) => {
    try {
      startRequest();
      const res = await axios.post(API_URL, taskData);
      await getAllToDoList();
      return res.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // update TODO LIST BY ID
  const updateToDoLists = async (id, updatedData) => {
    try {
      startRequest();
      const res = await axios.put(`${API_URL}/${id}`, {
        data: updatedData
      });
      await getAllToDoList();
      if (setSingleToDo) {
        setSingleToDo(res.data.data);
      }
      return res.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE TODO LIST BY ID
  const deleteToDoLists = async (id) => {
    try {
      startRequest();
      const res = await axios.delete(`${API_URL}/${id}`);
      await getAllToDoList();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllToDoList();
  }, []);


  return {
    toDoList,
    singleToDo,
    loading,
    error,
    getAllToDoList,
    getTODoListsById,
    createToDoList,
    updateToDoLists,
    deleteToDoLists,
  };
};

export default useFetchToDoList;

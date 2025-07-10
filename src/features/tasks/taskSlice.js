import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  ref,
  push,
  update,
  remove,
  onValue,
  query,
  orderByChild,
} from "firebase/database";
import { db } from "../../firebase/config";

const tasksRef = query(ref(db, "tasks"), orderByChild("createdAt"));

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  return new Promise((resolve) => {
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val() || {};
      const tasks = Object.entries(data).map(([id, task]) => ({ id, ...task }));
      resolve(tasks.reverse());
    });
  });
});

export const addTask = createAsyncThunk("tasks/addTask", async (text) => {
  const task = {
    text,
    completed: false,
    createdAt: Date.now(),
  };
  const taskRef = push(ref(db, "tasks"), task);
  return { ...task, id: taskRef.key };
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
  await remove(ref(db, `tasks/${id}`));
  return id;
});

export const toggleTask = createAsyncThunk("tasks/toggleTask", async ({ id, completed }) => {
  await update(ref(db, `tasks/${id}`), { completed });
  return { id, completed };
});

export const editTask = createAsyncThunk("tasks/editTask", async ({ id, text }) => {
  await update(ref(db, `tasks/${id}`), { text });
  return { id, text };
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    filter: "all",
    search: "",
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        const task = state.tasks.find((task) => task.id === action.payload.id);
        if (task) task.completed = action.payload.completed;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const task = state.tasks.find((task) => task.id === action.payload.id);
        if (task) task.text = action.payload.text;
      });
  },
});

export const { setFilter, setSearch } = taskSlice.actions;
export default taskSlice.reducer;

import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  getDocs,
  addDoc,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { ref } from "vue";
import exp from "constants";

// const config = {
//   apiKey: "AIzaSyB7CrZwaisaMKSn-ZrnUOY7bFFVfGTPZnU",
//   authDomain: "boat-925e2.firebaseapp.com",
//   projectId: "boat-925e2",
//   storageBucket: "boat-925e2.appspot.com",
//   messagingSenderId: "283415674733",
//   appId: "1:283415674733:web:8f36d2ce964325aafb6464",
//   measurementId: "G-SDD380TSH5",
// };
const config = {
  apiKey: "AIzaSyBiT_WbANpN4ntqRCvuV48EZ4x4lsxO5Wc",
  authDomain: "boat-51710.firebaseapp.com",
  projectId: "boat-51710",
  storageBucket: "boat-51710.appspot.com",
  messagingSenderId: "1093694730199",
  appId: "1:1093694730199:web:84e89bac8dfb79eed4a592",
  measurementId: "G-P535XQYL57",
};

const firebaseApp = initializeApp(config);

const db = getFirestore(firebaseApp);
const usersCollection = collection(db, "users");
const infosCollection = collection(db, "infos");
const placesCollection = collection(db, "places");
const vehicleCollection = collection(db, "vehicle");
const formCollection = collection(db, "register-leave-wharf");

export const checkUser = async (email: any, password: any) => {
  const querySnapshot = await getDocs(usersCollection);
  const docSnapshots = querySnapshot.docs;
  for (const doc of docSnapshots) {
    if (doc.get("email") === email && doc.get("password") === password) {
      return { ...(await doc.data()), id: doc.id };
    }
  }
  return {};
};

export const checkUserExist = async (email: any) => {
  const querySnapshot = await getDocs(usersCollection);
  const docSnapshots = querySnapshot.docs;
  for (const doc of docSnapshots) {
    if (doc.get("email") === email) {
      return true;
    }
  }
  return false;
};

export const forgotPassword = async (
  email: any,
  phonenumber: any,
  password: any
) => {
  const querySnapshot = await getDocs(usersCollection);
  const docSnapshots = querySnapshot.docs;
  let user: any = {};
  for (const doc of docSnapshots) {
    if (doc.get("email") === email && doc.get("phonenumber") === phonenumber) {
      user = { ...(await doc.data()), id: doc.id };
    }
  }
  try {
    if (user.id) {
      const docRef = doc(db, "users", user.id);
      delete user.id;
      user.password = password;
      await setDoc(docRef, user);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
  return false;
};

export const getUser = async (id: string) => {
  if (id) {
    const docRef = doc(db, "users", id);
    let form: any = {};
    form = await getDoc(docRef);
    return form.data();
  }
};

export const getUsers = async () => {
  const querySnapshot = await getDocs(usersCollection);
  const list: any = [];
  for (const doc of querySnapshot.docs) {
    list.push({ ...doc.data(), id: doc.id });
  }
  return list ?? [];
};

export const updateUser = async (id: string, data: any) => {
  if (id) {
    const docRef = doc(db, "users", id);
    let result = false;
    await setDoc(docRef, data)
      .then(() => {
        result = true;
      })
      .catch((error) => {
        result = false;
      });
    return result;
  }
  return false;
};

export const addUser = async (params: any) => {
  let result = false;
  await addDoc(usersCollection, params)
    .then(() => {
      result = true;
    })
    .catch((error) => {
      result = false;
    });
  return result;
};

export const getListVehicle = async () => {
  const querySnapshot = await getDocs(vehicleCollection);
  const list: any = [];
  for (const doc of querySnapshot.docs) {
    list.push({ ...(await doc.data()), id: doc.id });
  }
  return list ?? [];
};

export const getVehicle = async (id: string) => {
  if (id) {
    const docRef = doc(db, "vehicle", id);
    let vehicle: any = {};
    vehicle = await getDoc(docRef);
    return vehicle.data();
  }
};

export const updateVehicle = async (id: string, data: any) => {
  let result = false;
  const docRef = doc(db, "vehicle", id);
  await setDoc(docRef, data)
    .then(() => {
      result = true;
    })
    .catch((error) => {
      result = false;
    });
  return result;
};

export const getPlaces = async () => {
  const querySnapshot = await getDocs(placesCollection);
  const list: any = [];
  for (const doc of querySnapshot.docs) {
    list.push({ ...doc.data(), id: doc.id });
  }
  return list ?? [];
};

export const getInfos = async () => {
  const querySnapshot = await getDocs(infosCollection);
  const list: any = [];
  for (const doc of querySnapshot.docs) {
    list.push({ ...(await doc.data()), id: doc.id });
  }
  return list ?? [];
};

export const getInfo = async (id: string) => {
  if (id) {
    const docRef = doc(db, "infos", id);
    let form: any = {};
    form = await getDoc(docRef);
    return form.data();
  }
};

export const addVehicle = async (params: any) => {
  let result = false;

  await addDoc(vehicleCollection, params)
    .then(() => {
      result = true;
    })
    .catch((error) => {
      result = false;
    });
  return result;
};

export const addBussinessData = async (params: any) => {
  let result = false;
  await addDoc(formCollection, params)
    .then(() => {
      result = true;
    })
    .catch((error) => {
      result = false;
    });
  return result;
};

export const getBussinessData = async () => {
  const querySnapshot = await getDocs(formCollection);
  const list: any = [];
  for (const doc of querySnapshot.docs) {
    list.push({ ...doc.data(), id: doc.id });
  }
  return list ?? [];
};

export const getFormData = async (id: string) => {
  if (id) {
    const docRef = doc(db, "register-leave-wharf", id);
    let form: any = {};
    form = await getDoc(docRef);
    return form.data();
  }
};

export const updateFormData = async (id: string, data: any) => {
  let result = false;
  const docRef = doc(db, "register-leave-wharf", id);
  await setDoc(docRef, data)
    .then(() => {
      result = true;
    })
    .catch((error) => {
      result = false;
    });
  return result;
};

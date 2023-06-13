import { setCookie } from "cookies-next";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getCountFromServer,
  collection,
  getDocs,
  setDoc,
  where,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { AdminType, ClientType, ProfessionalData } from "types";

const adminsRef = collection(db, "admins");
const clientsRef = collection(db, "clients");
const professionalsRef = collection(db, "professionals");
const employeesRef = collection(db, "employees");

export const handleLogin = async ({ email, password }: any) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then(async ({ user }) => {
      if (user) {
        const adminQuery = query(adminsRef, where("uid", "==", user.uid));
        const clientQuery = query(clientsRef, where("uid", "==", user.uid));
        const professionalQuery = query(
          professionalsRef,
          where("uid", "==", user.uid)
        );
        const setUidCookie = setCookie("useruid", user.uid, { maxAge: 8600 });

        const selectedQuery = async () => {
          const hasAdmin = (await getCountFromServer(adminQuery)).data().count;
          const hasClient = (await getCountFromServer(clientQuery)).data()
            .count;
          const hasProfessional = (
            await getCountFromServer(professionalQuery)
          ).data().count;

          if (hasAdmin > 0) return "admins";
          else if (hasClient > 0) return "clients";
          else if (hasProfessional > 0) return "professionals";
        };

        const docString = await selectedQuery();
        if (docString) {
          const coll = collection(db, docString);
          const docRef = query(coll, where("uid", "==", user.uid));
          return await getDocs(docRef).then((userSnapshot) => {
            if (userSnapshot.docs.length > 0) {
              setUidCookie;
              return userSnapshot.docs[0].data();
            } else return undefined;
          });
        }
      }
    })
    .catch((err) => {
      if (err.code === "auth/user-not-found") {
        alert("Usuário não cadastrado!");
      } else if (err.code === "auth/wrong-password") {
        alert("Senha incorreta!");
      } else alert(err.code + " " + err.message);
    });
};

export const handlePersistLogin = async (user: any) => {
  const adminQuery = query(adminsRef, where("uid", "==", user.uid));
  const clientQuery = query(clientsRef, where("uid", "==", user.uid));
  const professionalQuery = query(
    professionalsRef,
    where("uid", "==", user.uid)
  );
  const setUidCookie = setCookie("useruid", user.uid, { maxAge: 8600 });

  const selectedQuery = async () => {
    const hasAdmin = (await getCountFromServer(adminQuery)).data().count;
    const hasClient = (await getCountFromServer(clientQuery)).data().count;
    const hasProfessional = (await getCountFromServer(professionalQuery)).data()
      .count;
    if (hasAdmin > 0) return "admins";
    else if (hasClient > 0) return "clients";
    else if (hasProfessional > 0) return "professionals";
  };

  const docString = await selectedQuery();
  if (docString) {
    const coll = collection(db, docString);
    const docRef = query(coll, where("uid", "==", user.uid));
    return await getDocs(docRef).then((userSnapshot) => {
      if (userSnapshot.docs.length > 0) {
        setUidCookie;
        const res = userSnapshot.docs[0]?.data();
        const finalUser = {
          ...res,
        };
        return finalUser;
      } else return undefined;
    });
  }
};

export const createUser = async ({ email, password, name, cpf }: any) => {
  return createUserWithEmailAndPassword(auth, email, password).then(
    async (res) => {
      const userData: ClientType = {
        name,
        cpf,
        email,
        address: {},
        anamnese: {},
        firstLetter: name.charAt(0).toUpperCase(),
        id: cpf,
        phone: "",
        profileImage: "",
        rg: "",
        uid: res.user.uid,
        role: "pre-register",
        dateBorn: "",
        sexo: "NENHUM",
        anamneseFilled: false,
      };
      if (res) {
        const userRef = doc(db, "clients", cpf);
        const verify = await getDoc(userRef);
        if (verify.exists()) {
          return await deleteUser(res.user).then(() => {
            return "CPF existente";
          });
        } else return await setDoc(userRef, userData);
      }
    }
  );
};

export const createUserLanding = async ({
  email,
  password,
  name,
  cpf,
}: any) => {
  return await createUserWithEmailAndPassword(auth, email, password).then(
    async (res) => {
      const userData: ClientType = {
        name,
        email,
        address: {},
        anamnese: {},
        cpf,
        firstLetter: name.charAt(0).toUpperCase(),
        id: cpf,
        phone: "",
        profileImage: "",
        rg: "",
        uid: res.user.uid,
        role: "pre-register",
        dateBorn: "",
        sexo: "NENHUM",
        anamneseFilled: false,
      };
      if (res) {
        const userRef = doc(db, "clients", cpf);
        const verify = await getDoc(userRef);
        if (verify.exists()) {
          return await deleteUser(res.user).then(() => {
            return "CPF existente";
          });
        } else return await setDoc(userRef, userData);
      }
    }
  );
};

export const createProfessional = async (
  data: ProfessionalData,
  password: string,
  cpf: string,
  phone: string
) => {
  const { name, cro, email, rg } = data;
  return createUserWithEmailAndPassword(auth, email, password).then(
    async (res) => {
      const professionalData: ProfessionalData = {
        cpf,
        cro,
        name,
        rg,
        email,
        phone,
        id: cpf,
        payments: [],
        protocols: [],
        treatments: [],
        profileImage: "",
        uid: res.user.uid,
        role: "professional",
        specialty: "implant",
        firstLetter: name.charAt(0).toUpperCase(),
      };
      if (res) {
        const profRef = doc(db, "professionals", cpf);
        return await setDoc(profRef, professionalData);
      }
    }
  );
};

export const createAdmin = async (
  data: any,
  password: string,
  cpf: string,
  phone: string
) => {
  const { name, email, rg } = data;
  return createUserWithEmailAndPassword(auth, email, password).then(
    async (res) => {
      const adminData = {
        cpf,
        name,
        rg,
        email,
        phone,
        id: cpf,
        profileImage: "",
        uid: res.user.uid,
        role: "admin",
        firstLetter: name.charAt(0).toUpperCase(),
        dateBorn: "",
      };
      if (res) {
        const profRef = doc(db, "admins", cpf);
        return await setDoc(profRef, adminData);
      }
    }
  );
};

export const createEmployee = async (
  data: any,
  password: string,
  cpf: string,
  phone: string
) => {
  const { name, email, rg } = data;
  return createUserWithEmailAndPassword(auth, email, password).then(
    async (res) => {
      const adminData = {
        cpf,
        name,
        rg,
        email,
        phone,
        id: cpf,
        profileImage: "",
        uid: res.user.uid,
        role: "employee",
        firstLetter: name.charAt(0).toUpperCase(),
        dateBorn: "",
      };
      if (res) {
        const profRef = doc(db, "employees", cpf);
        return await setDoc(profRef, adminData);
      }
    }
  );
};

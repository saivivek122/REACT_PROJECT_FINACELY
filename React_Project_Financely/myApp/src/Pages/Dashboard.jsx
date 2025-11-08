import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { Modal } from "antd";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import { addDoc, collection, getDoc, getDocs, query } from "firebase/firestore";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
import { auth, db } from "../firebase";
import TransactionsTable from "../components/TransactionsTable";
import ChartComponent from "../components/Charts";
import NoTransactions from "../components/NoTransactions";
import { deleteDoc,doc } from "firebase/firestore";
// import { where, updateDoc } from "firebase/firestore";


const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };
  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      Date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    addTransaction(newTransaction);
  };
  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID:", docRef.id);
      if (!many) toast.success("Transaction Added!");
      setTransactions((prev) => [...prev, transaction]);
      calculateBalance();
    } catch (e) {
      console.log("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }
  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);
  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push({id:doc.id,...doc.data()});
        console.log("the doc is",doc.data())
      });
      setTransactions(transactionArray);
      console.log("Transactions Array", transactionArray);
      toast.success("Transactions Fetched!");
    } else {
      toast.error("No User");
    }
    setLoading(false);
  }
  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });


async function deleteTransaction(id){
 try{
  await deleteDoc(doc(db,`users/${user.uid}/transactions/${id}`));
  setTransactions((prev)=>prev.filter((item)=>item.id!=id));
  toast.success("Transaction deleted");
 }
 catch(error){
  console.error("Error deleting transaction:",error);
  toast.error("Failed to delete transaction")
 }
}
// async function resetIncome() {
//   if (!user?.uid) {
//     toast.error("User not authenticated");
//     return;
//   }

//   try {
 
//     const q = query(collection(db, `users/${user.uid}/transactions`), where("type", "==", "income"));
//     const querySnapshot = await getDocs(q);

   
//     const updates = querySnapshot.docs.map((docItem) =>
//       updateDoc(doc(db, "users", user.uid, "transactions", docItem.id), { amount: 0 })
//     );
//     await Promise.all(updates);
//     setTransactions((prev) =>
//       prev.map((item) => (item.type === "income" ? { ...item, amount: 0 } : item))
//     );

//     toast.success("All income transactions reset to 0!");
//   } catch (error) {
//     console.error("Error resetting income:", error);
//     toast.error("Failed to reset income transactions");
//   }
// }

console.log("dashboard",transactions)
  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading....</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
           
          />
          {transactions && transactions.length != 0 ? (
            <ChartComponent sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          ></AddExpenseModal>
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          ></AddIncomeModal>
          <TransactionsTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
            deleteTransaction={deleteTransaction}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;

import {  Radio, Select, Table } from "antd";
import React, { useState } from "react";
import searchImg from "../../assets/search.svg";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";
import Button from "../Button";
const TransactionsTable = ({
  transactions,
  addTransaction,
  fetchTransactions,
  deleteTransaction
}) => {
  console.log("the..........the", transactions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
    },
    {
      title:"Action",
      key:"action",
      render:(text,record)=>(
        // <Button text="Delete"  onClick={()=>deleteTransaction(record.id)} blue={true}/>
        <button style={{width:"fitContent", 
          
          backgroundColor:"orange",
          border:"1px solid black",
          borderRadius:"5px",
          padding:"10px 20px",
          color:"black",
          cursor:"pointer"
        }} onClick={()=>deleteTransaction(record.id)}>Delete</button>
      )
    }
  ];

  // function deleteTransactions(id){
  //   console.log("deleted",id)
  //   console.log("delete",transactions)
  //   sortedTransactions.filter((item)=>{
  //     console.log("The id ",item.id)
  //   })
  // }
  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );
  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });
  function exportCSV() {
    var csv = unparse({
      fields: ["name", "type", "tag", "Date", "amount"],
      data: transactions,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            console.log("Transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transaction Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <div style={{ width: "96%", padding: "0rem 2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={searchImg} width="16" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
          />
        </div>

        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="sort-buttons">
        <h2>My Transactions</h2>

        <Radio.Group
          className="input-radio"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Sort by Date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
        </Radio.Group>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            width: "400px",
          }}
        >
          <button className="btn" onClick={exportCSV}>
            Export to CSV
          </button>
          <label for="file-csv" className="btn btn-blue">
            Import from CSV
          </label>
          <input
            id="file-csv"
            type="file"
            accept=".csv"
            required
            onChange={importFromCsv}
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div className="table">
      <Table  dataSource={sortedTransactions} columns={columns} />
   
      </div>
    </div>
  );
};

export default TransactionsTable;

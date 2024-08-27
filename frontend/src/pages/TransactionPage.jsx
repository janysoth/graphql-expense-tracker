import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_TRANSACTION } from "../graphql/queries/transaction.query";
import TransactionFormSkeleton from '../components/skeletons/TransactionFromSkeleton';
import { UPDATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from 'react-hot-toast';

const TransactionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, loading } = useQuery(GET_TRANSACTION, {
    variables: { id },
  });

  const [formData, setFormData] = useState({
    description: "",
    paymentType: "",
    category: "",
    amount: "",
    location: "",
    date: "",
  });

  useEffect(() => {
    if (data?.transaction) {
      const { description, paymentType, category, amount, location, date } = data.transaction;
      setFormData({
        description,
        paymentType,
        category,
        amount,
        location,
        date: new Date(+date).toISOString().split("T")[0],
      });
    }
  }, [data]);

  const [updateTransaction, { loading: loadingUpdate }] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);

    try {
      await updateTransaction({
        variables: {
          input: { ...formData, amount, transactionId: id },
        },
      });
      toast.success("Transaction updated successfully.");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <TransactionFormSkeleton />;

  return (
    <div className='h-screen max-w-4xl mx-auto flex flex-col items-center'>
      <p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
        Update this transaction
      </p>
      <form className='w-full max-w-lg flex flex-col gap-5 px-3' onSubmit={handleSubmit}>
        <div className='flex flex-wrap'>
          <div className='w-full'>
            <label htmlFor='description' className='block uppercase tracking-wide text-white text-xs font-bold mb-2'>
              Transaction
            </label>
            <input
              className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              id='description'
              name='description'
              type='text'
              placeholder='Rent, Groceries, Salary, etc.'
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className='flex flex-wrap gap-3'>
          <div className='w-full flex-1'>
            <label htmlFor='paymentType' className='block uppercase tracking-wide text-white text-xs font-bold mb-2'>
              Payment Type
            </label>
            <div className='relative'>
              <select
                className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                id='paymentType'
                name='paymentType'
                value={formData.paymentType}
                onChange={handleInputChange}
              >
                <option value="card">Card</option>
                <option value="cash">Cash</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                  <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                </svg>
              </div>
            </div>
          </div>

          <div className='w-full flex-1'>
            <label htmlFor='category' className='block uppercase tracking-wide text-white text-xs font-bold mb-2'>
              Category
            </label>
            <div className='relative'>
              <select
                className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                id='category'
                name='category'
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="saving">Saving</option>
                <option value="expense">Expense</option>
                <option value="investment">Investment</option>
                <option value="income">Income</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                  <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                </svg>
              </div>
            </div>
          </div>

          <div className='w-full flex-1'>
            <label htmlFor='amount' className='block uppercase text-white text-xs font-bold mb-2'>
              Amount ($)
            </label>
            <input
              className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              id='amount'
              name='amount'
              type='number'
              placeholder='150'
              value={formData.amount}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className='flex flex-wrap gap-3'>
          <div className='w-full flex-1'>
            <label htmlFor='location' className='block uppercase tracking-wide text-white text-xs font-bold mb-2'>
              Location
            </label>
            <input
              className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
              id='location'
              name='location'
              type='text'
              placeholder='New York'
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>

          <div className='w-full flex-1'>
            <label htmlFor='date' className='block uppercase tracking-wide text-white text-xs font-bold mb-2'>
              Date
            </label>
            <input
              type='date'
              name='date'
              id='date'
              className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
              placeholder='Select date'
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button
          type='submit'
          disabled={loadingUpdate}
          className='text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600'
        >
          {loadingUpdate ? "Updating..." : "Update Transaction"}
        </button>
      </form>
    </div>
  );
};

export default TransactionPage;
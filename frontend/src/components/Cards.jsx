import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import { GET_AUTHENTICATED_USER, GET_USER_AND_TRANSACTIONS } from "../graphql/queries/user.query";
import CardsSkeleton from "./skeletons/CardsSkeleton";

const Cards = () => {
  const { data: transactionsData, loading: transactionsLoading, error: transactionsError } = useQuery(GET_TRANSACTIONS);
  const { data: authUserData, loading: authUserLoading, error: authUserError } = useQuery(GET_AUTHENTICATED_USER);

  const userId = authUserData?.authUser?._id;

  const { data: userAndTransactionsData, loading: userAndTransactionsLoading, error: userAndTransactionsError } = useQuery(
    GET_USER_AND_TRANSACTIONS,
    {
      variables: { userId },
      skip: !userId,
    }
  );

  if (transactionsError || authUserError || userAndTransactionsError) {
    return <p>Error loading data.</p>;
  }

  console.log("userAndTransactions: ", userAndTransactionsData);

  const transactions = transactionsData?.transactions || [];

  return (
    <div className='w-full px-10 min-h-[40vh]'>
      <p className='text-5xl font-bold text-center my-10'>History</p>
      {/* Display loading spinner if any query is still loading */}
      {(transactionsLoading || authUserLoading || userAndTransactionsLoading) ? (

        <div className="grid grid-cols-2 gap-[4rem]">
          <CardsSkeleton />
          <CardsSkeleton />
        </div>
      ) : (
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <Card
                key={transaction._id}
                transaction={transaction}
                authUser={authUserData?.authUser}
              />
            ))
          ) : (
            <p className='text-2xl font-bold text-center w-full'>No transaction history found.</p>
          )}
        </div>)}
    </div>
  );
};

export default Cards;
export const handleTransaction = async (txPromise, setStatus) => {
  try {
    setStatus({ loading: true, error: null, success: false });
    const tx = await txPromise;
    await tx.wait();
    setStatus({ loading: false, error: null, success: true });
    return true;
  } catch (error) {
    console.error("Transaction failed:", error);
    let errorMessage = "Transaction failed. Please try again.";
    if (error.reason) errorMessage = error.reason;
    else if (error.message) errorMessage = error.message.split('(')[0];
    
    setStatus({ loading: false, error: errorMessage, success: false });
    return false;
  }
};

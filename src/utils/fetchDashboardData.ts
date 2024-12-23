export const fetchDashboardData = async (
    endpoint: string,
    symbol: string,
    callback: (data: any) => void,
    errorCallback: (error: any) => void) => {

    const response = await fetch(`/api/${endpoint}?symbol=${symbol}`);
    if (response.ok) {
        const data = await response.json();
        callback(data);
    } else {
        errorCallback(response);
    }
};
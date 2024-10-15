export type CarDetailsResponse = {
    vin: string
    country: string
    manufacturer: string
    model: string
    class: string
    region: string
    wmi: string
    vds: string
    vis: string
    year: string
}

export const getCarDetailsByVin = async (vin: string) => {
    const res = await fetch('https://api.api-ninjas.com/v1/vinlookup?vin=' + vin, {
        headers: [
            ["X-Api-Key", process.env.API_NINJA_API_KEY!]
        ]
    });

    const data = await res.json();

    return data as CarDetailsResponse;
}
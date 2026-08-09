const BASE_URL = 'https://kitsu.io/api/edge';

async function fetchAnimeFromKitsu(query = '', subtype = '', page = 1, limit = 20) {
    try {
        const offset = (page - 1) * limit;
        const params = new URLSearchParams();

        params.append('page[limit]', limit);
        params.append('page[offset]', offset);

        if(query.trim() !== '') {
            params.append('filter[text]', query.trim());
        }

        if(subtype.trim() !== '') {
            params.append('filter[subtype]', subtype.trim());
        }      
        

        const endpoint = `${BASE_URL}/anime?${params.toString()}`;

        const response = await fetch(endpoint, {
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        });

        if(!response.ok) {
            throw new Error(`Gagal mengambil data anime: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();

        return {
            data: json.data,
            totalCount: json.meta.count
        }

    } catch (error) {
        console.error('Error fetching anime data:', error);
        throw error;
    }
}

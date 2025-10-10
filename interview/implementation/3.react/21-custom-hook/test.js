const { useState, useCallback, useEffect, useRef } = require("react")

//data,isLoading, error
const useFetch = (url, options= {}) => {
    const [data,setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [currenRetryCount, setCurrenRetryCount] = useState(0)

    const {
        method = 'GET',
        headers = {},
        retryCount = 0,
        retryDelay = 1000,
        body = null,
        ...fetchOptions
    } = options

    //refs for abort controller & retryTimeout
    const abortControllerRef = useRef()
    const retryTimeoutRef = useRef()

    const fetchData =  useCallback( async () => {
        try {
            setLoading(true)
            abortControllerRef.current =  new AbortController()
            const { signal } = abortControllerRef.current
            const requestHeaders = {...headers}
            let requestBody = body
            if(body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)){
                requestHeaders['Content-Type'] = requestHeaders['Content-Type'] || 'application/json'
                requestBody = JSON.stringify(body)
            }
            const response = await fetch(url,{
                method,
                headers : requestHeaders,
                body: requestBody,
                signal,
                ...fetchOptions
            })
            if(!response.ok) {
                throw new Error(`HTTP error : status : ${response.status}`)
            }

            const respData = await response.json()
            setData(respData)
            setLoading(false)
            setCurrenRetryCount(0)
        }catch(err){
            if(err.name === 'AbortError') return
            setLoading(false)
            setError(err)
            if(currenRetryCount < retryCount) {
                retryTimeoutRef.current = setTimeout(()=>{
                    setCurrenRetryCount(prev=>prev+1)
                    fetchData();
                },retryDelay)
            }
            throw err
        }
    },[url,headers, method,body,retryCount,retryDelay,currenRetryCount,fetchOptions])

    useEffect(()=> {
        fetchData();
        return () =>{
            if(abortControllerRef.current){
                abortControllerRef.current.abort()
            }
            if(retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
            }
        }
    },[])

    return {
        loading,
        error,
        data, 
        refetch : fetchData
    }
}

export default useFetch;



/**
 * level 1 : just fetch
 * level 2 : add retry 
 * level 3 : add abort controller
 * level 4 : handle fetch options
 */
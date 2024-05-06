test("Query 1 test", async () => {
    var business = 'spinal';
    let result = [];
    await fetch(`http://localhost:8080/business_search?search_name=${business}`)
        .then(res=>res.json())
        .then(resJson=>{
            result = resJson.data;
        });
    expect(result[0].name).toBe('SpinalWorks Chiropractic');
})

test("Query 2 test", async () => {
    var business = '__1uG7MLxWGFIv2fCGPiQQ';
    let result = [];
    await fetch(`http://localhost:8080/business_review/${business}`)
        .then(res=>res.json())
        .then(resJson=>{
            result = resJson.data;
            //console.log(result);
        });
    expect(result[1].text).toBe('All staff is super friendly. Highly recommended.');
})

test("Query 3 test", async () => {
    var user = '___I9ZYdYGkZ6dMYxwJEIQ';
    let result = [];
    await fetch(`http://localhost:8080/user_review/${user}`)
        .then(res=>res.json())
        .then(resJson=>{
            result = resJson.data;
            //console.log(result);
        });
    expect(result[0].text).toBe('Have your hotel set this up . They get good seats for dinner');
})

test("Query 4 test", async () => {
    var name = 'spinal';
    let result = [];
    await fetch(`http://localhost:8080/business_name_search/${name}`)
        .then(res=>res.json())
        .then(resJson=>{
            result = resJson.data;
            //console.log(result);
            
        });
    expect(result[0].city).toBe('Las Vegas');
})

test("Query 5 test", async () => {
    var id = '__3qOwWFBUE8mdOToI7YrQ';
    let result = [];
    await fetch(`http://localhost:8080/business_id_search/${id}`)
        .then(res=>res.json())
        .then(resJson=>{
            result = resJson.data;
            
        });
    expect(result[0].name).toBe('Custom Kings');
})

test("Query 6 test", async () => {
    let result = [];
    await fetch(`http://localhost:8080/influential_user`)
        .then(res=>res.json())
        .then(resJson=>{
            result = resJson.data;
            
        });
    expect(result[0].name).toBe('Momo');
}, 100 * 1000)

test("Query 8 test", async () => {
    let result = [];
    await fetch(`http://localhost:8080/recent_review`)
        .then(res=>res.json())
        .then(resJson=>{
            result = resJson.data;
            
        });
    expect(result[0].UserName).toBe('Melanie');
},100 * 1000)

test("Query 9 test", async () => {
    var id = '__6jYJ6Hm-Qq8XQEGDrOGQ';
    let result = [];
    await fetch(`http://localhost:8080/business_popularity/${id}`)
        .then(res=>res.json())
        .then(resJson=>{
            result = resJson.data;
            
        });
    expect(result[0].month).toBe('08');
})

test("Query 10 test", async () => {
    var state = 'NV';
    var category = 'printing'
    let result = [];
    await fetch(`http://localhost:8080/num_business_in_area/${state}/${category}`)
        .then(res=>res.json())
        .then(resJson=>{
            result = resJson.data;
            
        });
    expect(result[0].num).toBe(259);
})
const constantUrl = "http://localhost:3000";

const getData = async(table, index=-1) => {
  const supplement = index !== -1 ? `${table}/${index}` : table
  const url = `${constantUrl}/${supplement}`;
  try{
    const response = await fetch(url);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log('Il y a eu un problème avec l\'opération de recuperation : ' + error.message);
  }
}

const saveData = async(table, datas, index=-1) => {
  const url =  index !== -1 ? `${constantUrl}/${table}/${parseInt(index+1)}` : `${constantUrl}/${table}`;
  const method  = index !== -1 ? "PUT" : "POST";
  const option = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: method,
    body: JSON.stringify(datas)
  }
  try{
    const response = await fetch(url, option);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log('Il y a eu un problème avec l\'opération de sauvegarde : ' + error.message);
  }
}

const deleteData = async(table, index) => {
  const url =  `${constantUrl}/${table}/${index}`;
  const option = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "DELETE"
  }
  try{
    const response = await fetch(url, option);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log('Il y a eu un problème avec l\'opération de suppression : ' + error.message);
  }
}
function Test(){
    const isActive = true;
return <div className={`${isActive ? 'bg-blue-500' : 'bg-gray-500'} p-4`}>Hello</div>;

}

export default Test
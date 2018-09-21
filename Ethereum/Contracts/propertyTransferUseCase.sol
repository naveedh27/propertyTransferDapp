pragma solidity ^0.4.11;

contract PropertyTransfer {

    address public DA; 
    uint256 public totalNoOfProperty; 

    function PropertyTransfer(string name) public{
        DA = msg.sender;
        nameOfOwners[msg.sender] = name;
        
        propetyDetails["Sold"].name = "NA";
        propetyDetails["Sold"].purpose = "NA";
        propetyDetails["Sold"].aadhar = "NA";
        propetyDetails["Sold"].LALO = "NA";
        propetyDetails["Sold"].addressOfProp = "NA";
        propetyDetails["Sold"].isDisputedProp = false;
        propetyDetails["Sold"].isInheritable = false;
        propetyDetails["Sold"].currentOwner = DA;
        propetyDetails["Sold"].isSold = false;
        
    }
    
    modifier onlyOwner(){
        require(msg.sender == DA);
        _;
    }

     struct Property{
        string name;
        string purpose;
        string aadhar;
        string LALO;
        string addressOfProp;
        bool isDisputedProp;
        bool isInheritable;
        address currentOwner;
        bool isSold;
    } 
    mapping(string => Property) propetyDetails;
    mapping(address => mapping(uint256=>string)) public  propertiesOwner;
    mapping(address => uint256)  individualCountOfPropertyPerOwner;
    mapping(address => string) public nameOfOwners;
    
    
    event PropertyAlloted(address indexed _verifiedOwner, uint256 indexed  _totalNoOfPropertyCurrently, string _nameOfProperty, string _msg);
    event PropertyTransferred(address indexed _from, address indexed _to, string _propertyName, string _msg);
    
    function getPropertyCountOfAnyAddress() public view returns (uint256, uint256) {
        uint count = 0;
        for(uint i = 0; i<individualCountOfPropertyPerOwner[msg.sender];i++){
            string memory tempPropName = propertiesOwner[msg.sender][i];
            if(!stringsEqual(tempPropName, "Sold")){
                count++;
            }   
        }
        return (individualCountOfPropertyPerOwner[msg.sender],count);
    }

    function setNameOfOwners(string name) public {
        nameOfOwners[msg.sender] = name;
    }
    
    function allotProperty(address _verifiedOwner, string ownerName,  string _propertyName, string purpose,string aadhar,string LALO,string addressOfProp,bool isDisputedProp, bool isInheritable) public
    onlyOwner
    {   
        propetyDetails[_propertyName].name = _propertyName;
        propetyDetails[_propertyName].purpose = purpose;
        propetyDetails[_propertyName].aadhar = aadhar;
        propetyDetails[_propertyName].LALO = LALO;
        propetyDetails[_propertyName].addressOfProp = addressOfProp;
        propetyDetails[_propertyName].isDisputedProp = isDisputedProp;
        propetyDetails[_propertyName].isInheritable = isInheritable;
        propetyDetails[_propertyName].currentOwner = _verifiedOwner;
        propetyDetails[_propertyName].isSold = false;
        
        propertiesOwner[_verifiedOwner][individualCountOfPropertyPerOwner[_verifiedOwner]++] = _propertyName;
        
        totalNoOfProperty++;
        
        nameOfOwners[_verifiedOwner] = ownerName;
        
        PropertyAlloted(_verifiedOwner,individualCountOfPropertyPerOwner[_verifiedOwner], _propertyName, "property allotted successfully");
    }
    
    function isOwner(address _checkOwnerAddress, string _propertyName) public constant returns (uint){
        
        if(propetyDetails[_propertyName].currentOwner == _checkOwnerAddress){  
            return 1;
        } else{
            return 999999999;
        }   
          
    }
    
    function getPropertyDetails(string _propertyName) public constant
    returns (string,string,string,string,address,bool,bool){
        
        return(propetyDetails[_propertyName].purpose, 
            propetyDetails[_propertyName].aadhar,
            propetyDetails[_propertyName].LALO,
            propetyDetails[_propertyName].addressOfProp,
            propetyDetails[_propertyName].currentOwner,
            propetyDetails[_propertyName].isDisputedProp,
            propetyDetails[_propertyName].isInheritable);
        
    }
    
    function stringsEqual (string a1, string a2)  public constant returns (bool){
            return sha256(a1) == sha256(a2);
    }
    
    function transferProperty (address _to, string _propertyName) public
      returns (bool ,  uint )
    {
        uint256 checkOwner = isOwner(msg.sender, _propertyName);
        bool flag = false;
        uint i = 0;
        if(checkOwner != 999999999){
            
            
            for(i=0 ; i<individualCountOfPropertyPerOwner[msg.sender]; i++){
                if( stringsEqual(propetyDetails[propertiesOwner[msg.sender][i]].name, _propertyName)){
                    
                    propetyDetails[propertiesOwner[msg.sender][i]].currentOwner = _to; 
                    
                    propertiesOwner[msg.sender][i] = "Sold";
                    
                    propertiesOwner[_to][individualCountOfPropertyPerOwner[_to]] = _propertyName;
                    individualCountOfPropertyPerOwner[_to]++;
                    
                    flag = true;
                    
                    break;
                }
            }
            
            PropertyTransferred(msg.sender , _to, _propertyName, "Owner has been changed." );
             
        }else{
             PropertyTransferred(msg.sender , _to, _propertyName, "Owner doesn't own the property." );
        }
            
        return (flag, checkOwner);
    }

}
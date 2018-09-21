pragma solidity ^0.4.11;


    /// We're making this use case for mimicking the real world property transfer
    /// Pre-requisite of this use case is that:
    /// 1. A digital identity is in-place
    /// 2. Govt agrees to put the land records on the public blockchain
    /// 3. Each Development Authority (DA) becomes the defacto owner of the property that exist under their constituency/legislative body
    /// When all the above conditions are met, then DA(owner) can easily attach the respective property to their rightful owner after thorough verification verification.
    /// we shall be formulating the function around this set assumption.
    /// we're assuming that each DA shall deploy their own smart contract as per their rule and regulation. This whole smart contract is written by considering DA as the owner, who can allot property.
    /// A govt can become a layer on top of these DA. and the Govt can decide, which DA(address) becomes the owner of which contituency.
    /// We can extend this easily. But after going through this smart contract, you shall be able to figure out, how the things might work.
contract PropertyTransfer {

    address public DA; 
    uint256 public totalNoOfProperty; 

    // This is the constructor whose code is
    // run only when the contract is created.
    function PropertyTransfer(string name) public{
        DA = msg.sender; // setting the owner of the contract as DA. 
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
    
    
    /// modifier to check the tx is coming from the DA(owner) or not. 
    modifier onlyOwner(){
        require(msg.sender == DA);
        _;
    }

    /// This structure is kept like this for storing a lot more information than just the name
    struct Property{
        string name;//keeping the map of the property against each address. we shall provide name to the property
        string purpose;
        string aadhar;
        string LALO;
        string addressOfProp;
        bool isDisputedProp;
        bool isInheritable;
        address currentOwner;
        bool isSold;// we're keeping the count as well for each address
    } // reason for creating this structure is simple, that the details about properties can be multiple. e.g. Their GeoLocation, Address, dimension, Height etc. Right now, I'm saying it as just a name
    
    mapping(string => Property) propetyDetails;
    //mapping(address => mapping(ui nt256=>Property)) public  propertiesOwner; // we shall have the properties mapped against each address by its name and it's individual count.
    mapping(address => mapping(uint256=>string)) public  propertiesOwner;
    mapping(address => uint256)  individualCountOfPropertyPerOwner;// how many property does a particular person hold
    mapping(address => string) public nameOfOwners;
    
    
    event PropertyAlloted(address indexed _verifiedOwner, uint256 indexed  _totalNoOfPropertyCurrently, string _nameOfProperty, string _msg);
    event PropertyTransferred(address indexed _from, address indexed _to, string _propertyName, string _msg);
    
    /// this shall give us the exact property count which any address own at any point of time
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
    
    /// this function shall be called by DA only after verification
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
    
    /// check whether the owner have the said property or not. if yes, return the index
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
    
    /// functionality to check the equality of two strings in Solidity
    function stringsEqual (string a1, string a2)  public constant returns (bool){
            return sha256(a1) == sha256(a2);
    }
    
    /// transfer the property to the new owner
    /// todo : change from to msg.sender
   
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
            
            //individualCountOfPropertyPerOwner[msg.sender]--;
            PropertyTransferred(msg.sender , _to, _propertyName, "Owner has been changed." );
             
        }else{
             PropertyTransferred(msg.sender , _to, _propertyName, "Owner doesn't own the property." );
        }
            
        return (flag, checkOwner);
    }

}
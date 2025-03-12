// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract weifund {
    struct Request {
        string description;
        address payable recipient;
        uint256 value;
        bool isCompleted;
        uint256 noOfVoters;
        mapping(address => bool) voters;
    }

    mapping(address => uint256) public contributors;
    mapping(uint256 => Request) public requests;
    
    address public immutable manager;
    uint256 public immutable targetGoal;
    uint256 public immutable deadline;
    uint256 public constant MIN_CONTRIBUTION = 100 wei;
    uint256 public noOfContributors;
    uint256 public raisedAmount;
    uint256 public numRequests;
    
    event ContributionReceived(address contributor, uint256 amount);
    event RefundProcessed(address contributor, uint256 amount);
    event RequestCreated(uint256 requestId, string description, address recipient, uint256 value);
    event VoteCast(uint256 requestId, address voter);
    event PaymentMade(uint256 requestId, address recipient, uint256 amount);
    
    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }
    
    constructor(uint256 _targetGoal, uint256 _durationInSeconds) {
        manager = msg.sender;
        targetGoal = _targetGoal;
        deadline = block.timestamp + _durationInSeconds;
    }
    
    function contribute() external payable {
        require(block.timestamp < deadline, "Deadline has passed");
        require(msg.value >= MIN_CONTRIBUTION, "Contribution below minimum");
        
        if (contributors[msg.sender] == 0) {
            noOfContributors++;
        }
        
        contributors[msg.sender] += msg.value;
        raisedAmount += msg.value;
        
        emit ContributionReceived(msg.sender, msg.value);
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function refund() external {
        require(block.timestamp > deadline, "Deadline has not passed yet");
        require(raisedAmount < targetGoal, "Goal was reached, cannot refund");
        require(contributors[msg.sender] > 0, "No contribution found");
        
        uint256 amount = contributors[msg.sender];
        contributors[msg.sender] = 0;
        
        payable(msg.sender).transfer(amount);
        emit RefundProcessed(msg.sender, amount);
    }
    
    function createRequest(
        string calldata _description, 
        address payable _recipient, 
        uint256 _value
    ) external onlyManager {
        Request storage newRequest = requests[numRequests];
        
        newRequest.description = _description;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.isCompleted = false;
        newRequest.noOfVoters = 0;
        
        emit RequestCreated(numRequests, _description, _recipient, _value);
        numRequests++;
    }
    
    function voteRequest(uint256 _requestId) external {
        require(contributors[msg.sender] > 0, "Not a contributor");
        
        Request storage thisRequest = requests[_requestId];
        require(!thisRequest.voters[msg.sender], "Already voted");
        require(!thisRequest.isCompleted, "Request already completed");
        
        thisRequest.voters[msg.sender] = true;
        thisRequest.noOfVoters++;
        
        emit VoteCast(_requestId, msg.sender);
    }
    
    function makePayment(uint256 _requestId) external onlyManager {
        require(raisedAmount >= targetGoal, "Target goal not reached");
        
        Request storage thisRequest = requests[_requestId];
        require(!thisRequest.isCompleted, "Payment already made");
        require(
            thisRequest.noOfVoters > noOfContributors / 2, 
            "Majority approval not reached"
        );
        
        thisRequest.isCompleted = true;
        thisRequest.recipient.transfer(thisRequest.value);
        
        emit PaymentMade(_requestId, thisRequest.recipient, thisRequest.value);
    }
}
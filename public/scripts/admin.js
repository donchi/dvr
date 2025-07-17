import { CheckInVisitor } from "./components/checkin-visitor.js"
import { CheckOutDialogBox } from "./components/checkout-visitor.js";
import { ShowVerificationCode } from "./components/view-verification-code.js";
import { GetVisitDetails } from "./components/visitor-info.js";
import { PrintVisitorSlip } from "./components/visitor-slip.js";


document.addEventListener('DOMContentLoaded', ()=> {
  // visitor official check in
  CheckInVisitor();

  // print visitor slip
  PrintVisitorSlip();

  // check out dialog box
  CheckOutDialogBox();

  // view verification code
  ShowVerificationCode();

  // get visit details - visitor info
  GetVisitDetails();

})


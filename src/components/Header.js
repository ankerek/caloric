import React from 'react'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap'



export default class Header extends React.Component {
	constructor(props) {
    super(props);
  }

  render() {
    const { user, handleLogout } = this.props;

    const isUser = user.size !== 0;

    return (
      <Navbar staticTop={true}>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to="/">Jídelníček</IndexLink>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="Potraviny" id="basic-nav-dropdown">
              <LinkContainer to="/potraviny">
                <NavItem>Seznam potravin</NavItem>
              </LinkContainer>
              {isUser && 
              <LinkContainer to="/pridat-potravinu">
                <NavItem>Přidat potravinu</NavItem>
              </LinkContainer>
              }
            </NavDropdown>
            {isUser && 
            <LinkContainer to="/statistika">
              <NavItem>Statistika</NavItem>
            </LinkContainer>}
            {isUser && 
            <NavDropdown title="Nastavení" id="basic-nav-dropdown">
              <LinkContainer to="/nastaveni/predvolby">
                <NavItem>Předvolby</NavItem>
              </LinkContainer>
            </NavDropdown>}
          </Nav>
          
          { isUser && 
            <Navbar.Collapse>
              <Nav pullRight>
                <NavDropdown title={user.get('username')} id="basic-nav-dropdown2">
                  <LinkContainer to="/odhlasit" onClick={handleLogout}>
                    <NavItem>Odhlásit se</NavItem>
                  </LinkContainer>
                </NavDropdown>
              </Nav>
              <Navbar.Text pullRight>Přihlášen jako </Navbar.Text>
            </Navbar.Collapse> 
          }

          {
            !isUser && 
            <Nav pullRight>
              <LinkContainer to="/prihlaseni"><NavItem>Přihlášení</NavItem></LinkContainer>
              <LinkContainer to="/registrace"><NavItem>Registrace</NavItem></LinkContainer>
            </Nav>
          }
        </Navbar.Collapse> 
      </Navbar>
    )
  }
}

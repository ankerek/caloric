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
            <IndexLink to="/">Caloric</IndexLink>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <li><IndexLink to="/">Index</IndexLink></li>
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

            <LinkContainer to="/potraviny">
              <NavItem>Potraviny</NavItem>
            </LinkContainer>
            <LinkContainer to="/potravina/banan">
              <NavItem>Potravina</NavItem>
            </LinkContainer>
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

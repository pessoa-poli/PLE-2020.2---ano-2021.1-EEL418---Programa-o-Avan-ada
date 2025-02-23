import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Row, Card, Form, CardColumns } from "react-bootstrap";
import { Header, Button, ButtonContainer } from "./styles";
import "./Experiences.css";
import ExperienceService from "../../services/experienceService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCommentDots,
  faImage,
} from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
class ExperiencesPage extends Component {
  constructor(props) {
    super(props);

    this.ComentExperience = this.ComentExperience.bind(this);
    this.CancelComentExperience = this.CancelComentExperience.bind(this);
    this.SearchExperiences = this.SearchExperiences.bind(this);
    this.likeExperience = this.likeExperience.bind(this);
    this.SaveComment = this.SaveComment.bind(this);
    this.postImage = this.postImage.bind(this);
    this.GetImage = this.GetImage.bind(this);
    this.state = {
      list_experiences: [],
      imagem: null,
    };
  }

  async componentDidMount() {
    await this.SearchExperiences();
  }

  async likeExperience(_id) {
    const data_like_experience = {
      _id: _id,
    };

    try {
      const response_experiences = await ExperienceService.likeExperience(
        data_like_experience
      );
      console.log("like", response_experiences);
    } catch (err_like_experience) {
      console.log(err_like_experience);
    }

    await this.SearchExperiences();
  }
  state = {
    selectedFile: null,
  };
  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };
  onFileUpload = () => {
    const formData = new FormData();
    formData.append(
      "image",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    this.postImage(formData);
  };
  async postImage(data) {
    var user = localStorage.getItem("username");
    var token = localStorage.getItem("token");
    const ax = axios.create({
      baseURL: "http://localhost:4000/",
      headers: {
        "Content-type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        Authorization: "Bearer " + token,
      },
    });
    await ax.post("images/upload", data);
    this.image = true;
    this.GetImage();
  }
  async SearchExperiences() {
    var list_experiences = [];
    var data_experience = null;
    try {
      const response_experiences = await ExperienceService.getExperiences();
      console.log("conseguiu!", response_experiences);
      for (const [idx, obj] of response_experiences.data.entries()) {
        data_experience = {
          _id: obj._id,
          username: obj.username,
          name_usuario_child: "criança",
          description: obj.description,
          numLikes: obj.numLikes,
          comments: obj.comments,
        };
        list_experiences.push(data_experience);
      }
    } catch (err_experiences) {
      console.log(err_experiences);
    }

    this.setState({ list_experiences: list_experiences });

    console.log("list", list_experiences);
  }

  async SaveComment(key, _id) {
    var formId = "formTextComent" + key.toString();

    var description = document.getElementById(formId).value;

    console.log(description);

    var data_comment_experience = {
      _id: _id,
      username: localStorage.getItem("username"),
      description: description,
    };

    try {
      const response_comment_experiences =
        await ExperienceService.commentExperience(data_comment_experience);
      console.log("comment", response_comment_experiences);
    } catch (err_comment_experience) {
      console.log(err_comment_experience);
    }

    var form = "formComent" + key.toString();

    document.getElementById(formId).value = "";
    document.getElementById(form).classList.add("d-none");

    await this.SearchExperiences();
  }

  ComentExperience(key) {
    var formId = "formComent" + key.toString();
    document.getElementById(formId).classList.remove("d-none");
  }

  CancelComentExperience(key) {
    var formId = "formComent" + key.toString();
    document.getElementById(formId).classList.add("d-none");
  }
  async GetImage() {
    var token = localStorage.getItem("token");
    const ax = axios.create({
      baseURL: "http://localhost:4000/",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const a = await ax.get("images/download");
    console.log(a);
    this.setState({ imagem: a });
    return a;
  }

  render() {
    return (
      <div>
        <Header>
          <div id="headerid">
            <input type="file" onChange={this.onFileChange} />
            <button onClick={this.onFileUpload}>
              <FontAwesomeIcon icon={faImage} size="lg" />
              {this.image ? <img src={this.state.imagem.data} alt="" /> : <></>}
            </button>
          </div>
        </Header>
        <Container>
          <ButtonContainer>
            <LinkContainer to="/cadastrarExperiencia">
              <Button>Adicionar Experiência</Button>
            </LinkContainer>
          </ButtonContainer>
          <Row>
            <CardColumns>
              {
                //<Col xs>
              }
              {this.state.list_experiences.map((experience, i) => (
                <Card key={i} classname="card" style={{ width: "28vw" }}>
                  <Card.Body>
                    <Card.Title>{experience.username}</Card.Title>
                    {/*
                    <Card.Subtitle className="mb-2 text-muted">Mãe da {experience.name_usuario_child}</Card.Subtitle>
                     */}
                    <Card.Text className="text-muted">
                      {experience.description}
                    </Card.Text>
                    <Card.Link
                      className="like"
                      onClick={() => this.likeExperience(experience._id)}
                    >
                      {experience.numLikes}&nbsp;&nbsp;
                      <FontAwesomeIcon
                        icon={faHeart}
                        style={{ cursor: "pointer" }}
                        size="lg"
                      />
                      {/* 
                      <Card.Link className="like" href="#">  <i class="far fa-heart"></i> Curtir*/}
                    </Card.Link>
                    <Card.Link
                      className="like"
                      onClick={() => this.ComentExperience(i)}
                    >
                      <FontAwesomeIcon
                        icon={faCommentDots}
                        size="lg"
                        style={{ cursor: "pointer" }}
                      />
                      {/* <i class="far fa-comment-dots"></i> Comentar */}
                    </Card.Link>

                    <div style={{ marginTop: "10px" }}>
                      <Form>
                        <Form.Group
                          id={"formComent" + i}
                          controlId={"formGroupComentExperience" + i}
                          className=" d-none"
                        >
                          <Form.Control
                            id={"formTextComent" + i}
                            as="textarea"
                            rows={3}
                          />
                          <div style={{ marginLeft: "60%" }}>
                            <Card.Link
                              className="like"
                              onClick={() => this.CancelComentExperience(i)}
                              style={{ cursor: "pointer" }}
                            >
                              Cancelar
                            </Card.Link>
                            <Card.Link
                              className="like"
                              onClick={() =>
                                this.SaveComment(i, experience._id)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              Salvar
                            </Card.Link>
                          </div>
                        </Form.Group>
                      </Form>
                    </div>

                    {Object.keys(experience.comments).length !== 0 ? (
                      <div
                        className="ExperienceComents"
                        style={{ marginLeft: "1vw", marginTop: "1vh" }}
                      >
                        {experience.comments.map((comment, c) => (
                          <>
                            <Card.Subtitle className="mt-1 text-muted">
                              {comment.username}
                            </Card.Subtitle>
                            <Card.Text className="text-muted">
                              {comment.description}
                            </Card.Text>
                          </>
                        ))}
                      </div>
                    ) : (
                      <></>
                    )}
                  </Card.Body>
                </Card>
              ))}
              {
                //</Col>
              }
            </CardColumns>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ExperiencesPage;
